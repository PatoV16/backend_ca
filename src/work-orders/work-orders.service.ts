import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { UserEntity } from '../users/entities/user.entity';
import { Product } from '../inventory/entities/product.entity';
import { Exit } from '../inventory/entities/exit.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { WorkOrderProduct } from './entities/work-order-products.entity';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';

@Injectable()
export class WorkOrdersService {
  private readonly logger = new Logger(WorkOrdersService.name);

  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(WorkOrderProduct)
    private workOrderProductRepository: Repository<WorkOrderProduct>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Exit)
    private exitRepository: Repository<Exit>,
    private dataSource: DataSource,
  ) {}

  // ==================
  // GENERAR NÚMERO DE ORDEN
  // ==================
  private async generateOrderNumber(): Promise<string> {
    this.logger.debug('🔢 Generando número de orden');

    const year = new Date().getFullYear();
    const lastOrder = await this.workOrderRepository
      .createQueryBuilder('wo')
      .where('wo.numero_orden LIKE :pattern', { pattern: `OT-${year}-%` })
      .orderBy('wo.id_orden', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastOrder) {
      const parts = lastOrder.numero_orden.split('-');
      nextNumber = parseInt(parts[2]) + 1;
    }

    const numero = `OT-${year}-${nextNumber.toString().padStart(3, '0')}`;
    this.logger.debug(`🆕 Número generado: ${numero}`);

    return numero;
  }

  // ==================
  // CREATE
  // ==================
  async create(dto: CreateWorkOrderDto): Promise<WorkOrder> {
    this.logger.log(
      `🟢 Iniciando creación OT | Unidad: ${dto.numero_unidad} | Productos: ${dto.productos.length}`,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validar usuarios
      this.logger.debug('👤 Validando usuario asignado');
      const usuarioAsignado = await this.userRepository.findOne({
        where: { id: dto.id_usuario_asignado },
      });

      if (!usuarioAsignado) {
        this.logger.warn('⚠️ Usuario asignado no encontrado');
        throw new NotFoundException('Usuario asignado no encontrado');
      }

      this.logger.debug('👤 Validando usuario revisor');
      const usuarioRevisor = await this.userRepository.findOne({
        where: { id: dto.id_usuario_revisor },
      });

      if (!usuarioRevisor) {
        this.logger.warn('⚠️ Usuario revisor no encontrado');
        throw new NotFoundException('Usuario revisor no encontrado');
      }

      // 2. Validar productos
      this.logger.debug('📦 Validando productos y stock');
      for (const prod of dto.productos) {
        const product = await this.productRepository.findOne({
          where: { id_producto: prod.id_producto },
        });

        if (!product) {
          this.logger.warn(`❌ Producto no encontrado: ${prod.id_producto}`);
          throw new NotFoundException(
            `Producto ${prod.nombre_producto} no encontrado`,
          );
        }

        if (product.stock_actual < prod.cantidad) {
          this.logger.warn(
            `⚠️ Stock insuficiente | ${prod.nombre_producto} | ` +
            `Disponible: ${product.stock_actual} | Solicitado: ${prod.cantidad}`,
          );
          throw new BadRequestException(
            `Stock insuficiente para ${prod.nombre_producto}`,
          );
        }
      }

      // 3. Crear orden
      const numeroOrden = await this.generateOrderNumber();

      this.logger.debug(`📝 Creando OT ${numeroOrden}`);
      const workOrder = this.workOrderRepository.create({
        numero_orden: numeroOrden,
        fecha_orden: dto.fecha_orden,
        numero_unidad: dto.numero_unidad,
        descripcion: dto.descripcion,
        id_usuario_asignado: dto.id_usuario_asignado,
        id_usuario_revisor: dto.id_usuario_revisor,
        observaciones: dto.observaciones,
        estado: 'pendiente',
      });

      const savedOrder = await queryRunner.manager.save(workOrder);

      // 4. Productos + inventario
      for (const prod of dto.productos) {
        this.logger.debug(
          `➖ Descontando stock | Producto: ${prod.nombre_producto} | Cantidad: ${prod.cantidad}`,
        );

        const workOrderProduct = this.workOrderProductRepository.create({
          id_orden_trabajo: savedOrder.id_orden,
          id_producto: prod.id_producto,
          nombre_producto: prod.nombre_producto,
          cantidad: prod.cantidad,
          unidad: prod.unidad,
          costo_unitario: prod.costo_unitario,
          costo_total: prod.cantidad * prod.costo_unitario,
        });

        await queryRunner.manager.save(workOrderProduct);

        const product = await this.productRepository.findOne({
          where: { id_producto: prod.id_producto },
        });

        const exit = this.exitRepository.create({
          producto: product,
          cantidad: prod.cantidad,
          motivo: 'Orden de Trabajo',
          referencia: numeroOrden,
          observacion: `OT: ${dto.descripcion}`,
          costo_unitario: prod.costo_unitario,
        });

        await queryRunner.manager.save(exit);

        await queryRunner.manager.decrement(
          Product,
          { id_producto: prod.id_producto },
          'stock_actual',
          prod.cantidad,
        );
      }

      await queryRunner.commitTransaction();

      this.logger.log(
        `✅ OT CREADA | ${numeroOrden} | Asignado: ${usuarioAsignado.nombre}`,
      );

      return this.findOne(savedOrder.id_orden);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `❌ ERROR creando OT | ${error.message}`,
        error.stack,
      );
      throw error;
    } finally {
      await queryRunner.release();
      this.logger.debug('🔚 QueryRunner liberado');
    }
  }

  // ==================
  // FIND ALL
  // ==================
  async findAll(): Promise<WorkOrder[]> {
    this.logger.log('📋 Consultando todas las OT activas');
    return this.workOrderRepository.find({
      where: { activo: true },
      relations: ['usuario_asignado', 'usuario_revisor', 'productos'],
      order: { fecha_creacion: 'DESC' },
    });
  }

  // ==================
  // FIND ONE
  // ==================
  async findOne(id: number): Promise<WorkOrder> {
    this.logger.debug(`🔍 Buscando OT ID: ${id}`);

    const order = await this.workOrderRepository.findOne({
      where: { id_orden: id },
      relations: ['usuario_asignado', 'usuario_revisor', 'productos'],
    });

    if (!order) {
      this.logger.warn(`⚠️ OT ${id} no encontrada`);
      throw new NotFoundException(`Orden de trabajo ${id} no encontrada`);
    }

    return order;
  }

  // ==================
  // UPDATE
  // ==================
  async update(id: number, dto: UpdateWorkOrderDto): Promise<WorkOrder> {
    this.logger.log(`✏️ Actualizando OT ID: ${id}`);
    const order = await this.findOne(id);
    Object.assign(order, dto);
    await this.workOrderRepository.save(order);
    this.logger.log(`✅ OT ${id} actualizada`);
    return this.findOne(id);
  }

  // ==================
  // UPDATE STATUS
  // ==================
  async updateStatus(id: number, estado: string): Promise<WorkOrder> {
    this.logger.log(`🔄 Cambiando estado OT ${id} → ${estado}`);
    const order = await this.findOne(id);
    order.estado = estado;
    await this.workOrderRepository.save(order);
    return this.findOne(id);
  }

  // ==================
  // DELETE (SOFT)
  // ==================
  async remove(id: number): Promise<void> {
    this.logger.warn(`🗑️ Soft delete OT ID: ${id}`);
    const order = await this.findOne(id);
    order.activo = false;
    await this.workOrderRepository.save(order);
  }

  // ==================
  // STATISTICS
  // ==================
  async getStatistics(): Promise<any> {
    this.logger.debug('📊 Calculando estadísticas de OT');

    return {
      total: await this.workOrderRepository.count({ where: { activo: true } }),
      pendientes: await this.workOrderRepository.count({
        where: { estado: 'pendiente', activo: true },
      }),
      enProceso: await this.workOrderRepository.count({
        where: { estado: 'en_proceso', activo: true },
      }),
      completadas: await this.workOrderRepository.count({
        where: { estado: 'completada', activo: true },
      }),
    };
  }
// ==================
// FIND BY STATUS
// ==================
async findByStatus(estado: string): Promise<WorkOrder[]> {
  this.logger.log(`📋 Buscando órdenes con estado: ${estado}`);

  return this.workOrderRepository.find({
    where: {
      estado,
      activo: true,
    },
    relations: ['usuario_asignado', 'usuario_revisor', 'productos'],
    order: { fecha_creacion: 'DESC' },
  });
}
// ==================
// FIND BY USER
// ==================
async findByUser(userId: string): Promise<WorkOrder[]> {
  this.logger.log(`📋 Buscando órdenes del usuario: ${userId}`);

  return this.workOrderRepository.find({
    where: [
      { id_usuario_asignado: userId, activo: true },
      { id_usuario_revisor: userId, activo: true },
    ],
    relations: ['usuario_asignado', 'usuario_revisor', 'productos'],
    order: { fecha_creacion: 'DESC' },
  });
}


}
