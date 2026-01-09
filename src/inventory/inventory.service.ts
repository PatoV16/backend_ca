import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Entry } from './entities/entry.entity';
import { Exit } from './entities/exit.entity';
import { Category } from './entities/category.entity';
import { Unit } from './entities/unit.entity';
import { Provider } from './entities/provider.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
    @InjectRepository(Exit)
    private exitRepository: Repository<Exit>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  /* ===== CATEGORIES ===== */
  async createCategory(data: Partial<Category>): Promise<Category> {
    this.logger.log(`Creando nueva categoría: ${data.nombre}`);
    const category = this.categoryRepository.create(data);
    const saved = await this.categoryRepository.save(category);
    this.logger.log(`Categoría creada exitosamente con ID: ${saved.id_categoria}`);
    return saved;
  }

  async findAllCategories(): Promise<Category[]> {
    this.logger.log('Consultando todas las categorías activas');
    const categories = await this.categoryRepository.find({
      where: { estado: true },
      relations: ['productos'],
    });
    this.logger.log(`Se encontraron ${categories.length} categorías activas`);
    return categories;
  }

  async findOneCategory(id: number): Promise<Category> {
    this.logger.log(`Consultando categoría ID: ${id}`);
    const category = await this.categoryRepository.findOne({
      where: { id_categoria: id },
      relations: ['productos'],
    });
    
    if (!category) {
      this.logger.warn(`Categoría con ID ${id} no encontrada`);
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    this.logger.log(`Categoría encontrada: ${category.nombre}`);
    return category;
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    this.logger.log(`Actualizando categoría ID: ${id}`);
    const category = await this.categoryRepository.findOne({
      where: { id_categoria: id },
    });
    
    if (!category) {
      this.logger.warn(`Categoría con ID ${id} no encontrada`);
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    Object.assign(category, data);
    const updated = await this.categoryRepository.save(category);
    this.logger.log(`Categoría ID: ${id} actualizada exitosamente`);
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    this.logger.log(`Eliminando (soft delete) categoría ID: ${id}`);
    const category = await this.categoryRepository.findOne({
      where: { id_categoria: id },
    });
    
    if (!category) {
      this.logger.warn(`Categoría con ID ${id} no encontrada para eliminar`);
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    category.estado = false;
    await this.categoryRepository.save(category);
    this.logger.log(`Categoría ID: ${id} desactivada exitosamente`);
  }

  /* ===== UNITS ===== */
  async createUnit(data: Partial<Unit>): Promise<Unit> {
    this.logger.log(`Creando nueva unidad: ${data.nombre} (${data.abreviatura})`);
    const unit = this.unitRepository.create(data);
    const saved = await this.unitRepository.save(unit);
    this.logger.log(`Unidad creada exitosamente con ID: ${saved.id_unidad}`);
    return saved;
  }

  async findAllUnits(): Promise<Unit[]> {
    this.logger.log('Consultando todas las unidades activas');
    const units = await this.unitRepository.find({
      where: { estado: true },
    });
    this.logger.log(`Se encontraron ${units.length} unidades activas`);
    return units;
  }

  async findOneUnit(id: number): Promise<Unit> {
    this.logger.log(`Consultando unidad ID: ${id}`);
    const unit = await this.unitRepository.findOne({
      where: { id_unidad: id },
      relations: ['productos'],
    });
    
    if (!unit) {
      this.logger.warn(`Unidad con ID ${id} no encontrada`);
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }

    this.logger.log(`Unidad encontrada: ${unit.nombre} (${unit.abreviatura})`);
    return unit;
  }

  async updateUnit(id: number, data: Partial<Unit>): Promise<Unit> {
    this.logger.log(`Actualizando unidad ID: ${id}`);
    const unit = await this.unitRepository.findOne({
      where: { id_unidad: id },
    });
    
    if (!unit) {
      this.logger.warn(`Unidad con ID ${id} no encontrada`);
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }

    Object.assign(unit, data);
    const updated = await this.unitRepository.save(unit);
    this.logger.log(`Unidad ID: ${id} actualizada exitosamente`);
    return updated;
  }

  async deleteUnit(id: number): Promise<void> {
    this.logger.log(`Eliminando (soft delete) unidad ID: ${id}`);
    const unit = await this.unitRepository.findOne({
      where: { id_unidad: id },
    });
    
    if (!unit) {
      this.logger.warn(`Unidad con ID ${id} no encontrada para eliminar`);
      throw new NotFoundException(`Unidad con ID ${id} no encontrada`);
    }

    unit.estado = false;
    await this.unitRepository.save(unit);
    this.logger.log(`Unidad ID: ${id} desactivada exitosamente`);
  }

  /* ===== PROVIDERS ===== */
  async createProvider(data: Partial<Provider>): Promise<Provider> {
    this.logger.log(`Creando nuevo proveedor: ${data.nombre} (RUC: ${data.ruc})`);
    const provider = this.providerRepository.create(data);
    const saved = await this.providerRepository.save(provider);
    this.logger.log(`Proveedor creado exitosamente con ID: ${saved.id_proveedor}`);
    return saved;
  }

  async findAllProviders(): Promise<Provider[]> {
    this.logger.log('Consultando todos los proveedores activos');
    const providers = await this.providerRepository.find({
      where: { estado: true },
    });
    this.logger.log(`Se encontraron ${providers.length} proveedores activos`);
    return providers;
  }

  async findOneProvider(id: number): Promise<Provider> {
    this.logger.log(`Consultando proveedor ID: ${id}`);
    const provider = await this.providerRepository.findOne({
      where: { id_proveedor: id },
      relations: ['entradas'],
    });
    
    if (!provider) {
      this.logger.warn(`Proveedor con ID ${id} no encontrado`);
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    this.logger.log(`Proveedor encontrado: ${provider.nombre} (RUC: ${provider.ruc})`);
    return provider;
  }

  async updateProvider(id: number, data: Partial<Provider>): Promise<Provider> {
    this.logger.log(`Actualizando proveedor ID: ${id}`);
    const provider = await this.providerRepository.findOne({
      where: { id_proveedor: id },
    });
    
    if (!provider) {
      this.logger.warn(`Proveedor con ID ${id} no encontrado`);
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    Object.assign(provider, data);
    const updated = await this.providerRepository.save(provider);
    this.logger.log(`Proveedor ID: ${id} actualizado exitosamente`);
    return updated;
  }

  async deleteProvider(id: number): Promise<void> {
    this.logger.log(`Eliminando (soft delete) proveedor ID: ${id}`);
    const provider = await this.providerRepository.findOne({
      where: { id_proveedor: id },
    });
    
    if (!provider) {
      this.logger.warn(`Proveedor con ID ${id} no encontrado para eliminar`);
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }

    provider.estado = false;
    await this.providerRepository.save(provider);
    this.logger.log(`Proveedor ID: ${id} desactivado exitosamente`);
  }

  /* ===== PRODUCTS ===== */
 
async createProduct(dto: CreateProductDto): Promise<Product> {
  this.logger.log(`Creando nuevo producto: ${dto.nombre}`);

  const categoria = await this.categoryRepository.findOne({
    where: { id_categoria: dto.id_categoria },
  });

  if (!categoria) {
    this.logger.warn(`Categoría ID ${dto.id_categoria} no encontrada`);
    throw new NotFoundException(`Categoría no encontrada`);
  }

  const unidad = await this.unitRepository.findOne({
    where: { id_unidad: dto.id_unidad },
  });

  if (!unidad) {
    this.logger.warn(`Unidad ID ${dto.id_unidad} no encontrada`);
    throw new NotFoundException(`Unidad no encontrada`);
  }

  const proveedor = await this.providerRepository.findOne({
    where: { id_proveedor: dto.id_proveedor },
  });

  if (!proveedor) {
    this.logger.warn(`Proveedor ID ${dto.id_proveedor} no encontrado`);
    throw new NotFoundException(`Proveedor no encontrado`);
  }

  const product = this.productRepository.create({
    nombre: dto.nombre,
    descripcion: dto.descripcion,
    stock_minimo: dto.stock_minimo,
    stock_maximo: dto.stock_maximo,
    precio_unitario: dto.precio_unitario,
    categoria,
    unidad,
    proveedor,
  });

  const saved = await this.productRepository.save(product);

  this.logger.log(
    `Producto creado exitosamente ID: ${saved.id_producto}, ` +
    `Proveedor: ${proveedor.nombre}`
  );

  return saved;
}

  async findAllProducts(): Promise<Product[]> {
    this.logger.log('Consultando todos los productos activos');
    const products = await this.productRepository.find({
      where: { estado: true },
      relations: ['categoria', 'unidad'],
    });
    this.logger.log(`Se encontraron ${products.length} productos activos`);
    return products;
  }

  async findOneProduct(id: number): Promise<Product> {
    this.logger.log(`Consultando producto ID: ${id}`);
    const product = await this.productRepository.findOne({
      where: { id_producto: id },
      relations: ['categoria', 'unidad', 'entradas', 'salidas'],
    });
    
    if (!product) {
      this.logger.warn(`Producto con ID ${id} no encontrado`);
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    this.logger.log(`Producto encontrado: ${product.nombre} (Stock: ${product.stock_actual})`);
    return product;
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    this.logger.log(`Actualizando producto ID: ${id}`);
    const product = await this.productRepository.findOne({
      where: { id_producto: id },
    });
    
    if (!product) {
      this.logger.warn(`Producto con ID ${id} no encontrado`);
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    Object.assign(product, data);
    const updated = await this.productRepository.save(product);
    this.logger.log(`Producto ID: ${id} actualizado exitosamente`);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    this.logger.log(`Eliminando (soft delete) producto ID: ${id}`);
    const product = await this.productRepository.findOne({
      where: { id_producto: id },
    });
    
    if (!product) {
      this.logger.warn(`Producto con ID ${id} no encontrado para eliminar`);
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    product.estado = false;
    await this.productRepository.save(product);
    this.logger.log(`Producto ID: ${id} desactivado exitosamente`);
  }

  /* ===== ENTRIES ===== */
  async createEntry(data: any): Promise<Entry> {
    this.logger.log(`Iniciando registro de entrada para producto ID: ${data.id_producto}`);
    
    const product = await this.productRepository.findOne({
      where: { id_producto: data.id_producto },
    });

    if (!product) {
      this.logger.error(`Producto con ID ${data.id_producto} no encontrado`);
      throw new NotFoundException(`Producto con ID ${data.id_producto} no encontrado`);
    }

    const provider = await this.providerRepository.findOne({
      where: { id_proveedor: data.id_proveedor },
    });

    if (!provider) {
      this.logger.error(`Proveedor con ID ${data.id_proveedor} no encontrado`);
      throw new NotFoundException(`Proveedor con ID ${data.id_proveedor} no encontrado`);
    }

    const entry = this.entryRepository.create({
      producto: product,
      proveedor: provider,
      cantidad: data.cantidad,
      precio_unitario: data.precio_unitario,
      numero_factura: data.numero_factura,
      observacion: data.observacion,
    });

    entry.total = entry.cantidad * entry.precio_unitario;

    this.logger.log(
      `Registrando entrada: Producto="${product.nombre}", Cantidad=${data.cantidad}, ` +
      `Precio Unitario=$${data.precio_unitario}, Total=$${entry.total}`
    );

    const savedEntry = await this.entryRepository.save(entry);

    const stockAnterior = product.stock_actual;
    await this.updateProductStock(product.id_producto);
    await this.updateAverageCost(product.id_producto);

    const productUpdated = await this.productRepository.findOne({
      where: { id_producto: product.id_producto },
    });

    this.logger.log(
      `Entrada registrada exitosamente. Stock anterior: ${stockAnterior}, ` +
      `Stock actual: ${productUpdated.stock_actual}, ` +
      `Costo promedio: $${productUpdated.costo_promedio.toFixed(2)}`
    );

    return savedEntry;
  }

  async findAllEntries(): Promise<Entry[]> {
    this.logger.log('Consultando todas las entradas de inventario');
    const entries = await this.entryRepository.find({
      relations: ['producto', 'proveedor'],
      order: { fecha_entrada: 'DESC' },
    });
    this.logger.log(`Se encontraron ${entries.length} entradas registradas`);
    return entries;
  }

  async findOneEntry(id: number): Promise<Entry> {
    this.logger.log(`Consultando entrada ID: ${id}`);
    const entry = await this.entryRepository.findOne({
      where: { id_entrada: id },
      relations: ['producto', 'proveedor', 'producto.categoria', 'producto.unidad'],
    });
    
    if (!entry) {
      this.logger.warn(`Entrada con ID ${id} no encontrada`);
      throw new NotFoundException(`Entrada con ID ${id} no encontrada`);
    }

    this.logger.log(
      `Entrada encontrada: Producto="${entry.producto.nombre}", ` +
      `Cantidad=${entry.cantidad}, Proveedor="${entry.proveedor.nombre}"`
    );
    return entry;
  }

  async deleteEntry(id: number): Promise<void> {
    this.logger.log(`Eliminando entrada ID: ${id}`);
    const entry = await this.entryRepository.findOne({
      where: { id_entrada: id },
      relations: ['producto'],
    });
    
    if (!entry) {
      this.logger.warn(`Entrada con ID ${id} no encontrada`);
      throw new NotFoundException(`Entrada con ID ${id} no encontrada`);
    }

    const productId = entry.producto.id_producto;
    const productName = entry.producto.nombre;
    const cantidad = entry.cantidad;

    await this.entryRepository.remove(entry);

    this.logger.log(`Entrada eliminada: Producto="${productName}", Cantidad=${cantidad}`);

    await this.updateProductStock(productId);
    await this.updateAverageCost(productId);

    this.logger.log(`Stock y costo promedio recalculados para producto ID: ${productId}`);
  }

  /* ===== EXITS ===== */
  async createExit(data: any): Promise<Exit> {
    this.logger.log(`Iniciando registro de salida para producto ID: ${data.id_producto}`);
    
    const product = await this.productRepository.findOne({
      where: { id_producto: data.id_producto },
    });

    if (!product) {
      this.logger.error(`Producto con ID ${data.id_producto} no encontrado`);
      throw new NotFoundException(`Producto con ID ${data.id_producto} no encontrado`);
    }

    if (product.stock_actual < data.cantidad) {
      this.logger.warn(
        `Stock insuficiente para producto "${product.nombre}". ` +
        `Stock actual: ${product.stock_actual}, Solicitado: ${data.cantidad}`
      );
      throw new BadRequestException(
        `Stock insuficiente. Stock actual: ${product.stock_actual}, solicitado: ${data.cantidad}`
      );
    }

    const exit = this.exitRepository.create({
      producto: product,
      cantidad: data.cantidad,
      motivo: data.motivo,
      referencia: data.referencia,
      observacion: data.observacion,
      costo_unitario: product.costo_promedio,
    });

    this.logger.log(
      `Registrando salida: Producto="${product.nombre}", Cantidad=${data.cantidad}, ` +
      `Motivo="${data.motivo}", Costo Unitario=$${product.costo_promedio.toFixed(2)}`
    );

    const savedExit = await this.exitRepository.save(exit);

    const stockAnterior = product.stock_actual;
    await this.updateProductStock(product.id_producto);

    const productUpdated = await this.productRepository.findOne({
      where: { id_producto: product.id_producto },
    });

    this.logger.log(
      `Salida registrada exitosamente. Stock anterior: ${stockAnterior}, ` +
      `Stock actual: ${productUpdated.stock_actual}`
    );

    if (productUpdated.stock_actual <= productUpdated.stock_minimo) {
      this.logger.warn(
        `⚠️ ALERTA: El producto "${product.nombre}" está en stock bajo. ` +
        `Stock actual: ${productUpdated.stock_actual}, Stock mínimo: ${productUpdated.stock_minimo}`
      );
    }

    return savedExit;
  }

  async findAllExits(): Promise<Exit[]> {
    this.logger.log('Consultando todas las salidas de inventario');
    const exits = await this.exitRepository.find({
      relations: ['producto'],
      order: { fecha_salida: 'DESC' },
    });
    this.logger.log(`Se encontraron ${exits.length} salidas registradas`);
    return exits;
  }

  async findOneExit(id: number): Promise<Exit> {
    this.logger.log(`Consultando salida ID: ${id}`);
    const exit = await this.exitRepository.findOne({
      where: { id_salida: id },
      relations: ['producto', 'producto.categoria', 'producto.unidad'],
    });
    
    if (!exit) {
      this.logger.warn(`Salida con ID ${id} no encontrada`);
      throw new NotFoundException(`Salida con ID ${id} no encontrada`);
    }

    this.logger.log(
      `Salida encontrada: Producto="${exit.producto.nombre}", ` +
      `Cantidad=${exit.cantidad}, Motivo="${exit.motivo}"`
    );
    return exit;
  }

  async deleteExit(id: number): Promise<void> {
    this.logger.log(`Eliminando salida ID: ${id}`);
    const exit = await this.exitRepository.findOne({
      where: { id_salida: id },
      relations: ['producto'],
    });
    
    if (!exit) {
      this.logger.warn(`Salida con ID ${id} no encontrada`);
      throw new NotFoundException(`Salida con ID ${id} no encontrada`);
    }

    const productId = exit.producto.id_producto;
    const productName = exit.producto.nombre;
    const cantidad = exit.cantidad;

    await this.exitRepository.remove(exit);

    this.logger.log(`Salida eliminada: Producto="${productName}", Cantidad=${cantidad}`);

    await this.updateProductStock(productId);

    this.logger.log(`Stock recalculado para producto ID: ${productId}`);
  }

  /* ===== STOCK ===== */
  async getStock(): Promise<any[]> {
    this.logger.log('Generando reporte de stock actual');
    const products = await this.productRepository.find({
      where: { estado: true },
      relations: ['categoria', 'unidad'],
    });

    const stockReport = products.map(product => ({
      id_producto: product.id_producto,
      nombre: product.nombre,
      categoria: product.categoria?.nombre,
      unidad: product.unidad?.abreviatura,
      stock_actual: product.stock_actual,
      stock_minimo: product.stock_minimo,
      stock_maximo: product.stock_maximo,
      costo_promedio: product.costo_promedio,
      precio_unitario: product.precio_unitario,
      valor_inventario: product.stock_actual * product.costo_promedio,
      alerta: product.stock_actual <= product.stock_minimo ? 'BAJO' : 'OK',
    }));

    const productosConStockBajo = stockReport.filter(p => p.alerta === 'BAJO').length;
    const valorTotalInventario = stockReport.reduce((sum, p) => sum + p.valor_inventario, 0);

    this.logger.log(
      `Reporte generado: ${products.length} productos, ` +
      `${productosConStockBajo} con stock bajo, ` +
      `Valor total inventario: $${valorTotalInventario.toFixed(2)}`
    );

    return stockReport;
  }

  /* ===== MÉTODOS AUXILIARES ===== */
  
  private async updateProductStock(productId: number): Promise<void> {
    this.logger.debug(`Actualizando stock del producto ID: ${productId}`);
    
    const totalEntries = await this.entryRepository
      .createQueryBuilder('entry')
      .select('COALESCE(SUM(entry.cantidad), 0)', 'total')
      .where('entry.productoIdProducto = :productId', { productId })
      .getRawOne();

    const totalExits = await this.exitRepository
      .createQueryBuilder('exit')
      .select('COALESCE(SUM(exit.cantidad), 0)', 'total')
      .where('exit.productoIdProducto = :productId', { productId })
      .getRawOne();

    const stockActual = Number(totalEntries.total) - Number(totalExits.total);

    await this.productRepository.update(productId, {
      stock_actual: stockActual,
    });

    this.logger.debug(
      `Stock actualizado: Producto ID ${productId}, ` +
      `Entradas: ${totalEntries.total}, Salidas: ${totalExits.total}, ` +
      `Stock Final: ${stockActual}`
    );
  }

  private async updateAverageCost(productId: number): Promise<void> {
    this.logger.debug(`Calculando costo promedio del producto ID: ${productId}`);
    
    const entries = await this.entryRepository.find({
      where: { producto: { id_producto: productId } },
      order: { fecha_entrada: 'ASC' },
    });

    if (entries.length === 0) {
      await this.productRepository.update(productId, { costo_promedio: 0 });
      this.logger.debug(`Costo promedio establecido en 0 (sin entradas)`);
      return;
    }

    let totalCost = 0;
    let totalQuantity = 0;

    entries.forEach(entry => {
      totalCost += entry.cantidad * entry.precio_unitario;
      totalQuantity += entry.cantidad;
    });

    const averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;

    await this.productRepository.update(productId, {
      costo_promedio: averageCost,
    });

    this.logger.debug(
      `Costo promedio actualizado: Producto ID ${productId}, ` +
      `${entries.length} entradas, Costo promedio: $${averageCost.toFixed(2)}`
    );
  }
}