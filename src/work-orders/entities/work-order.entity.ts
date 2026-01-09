import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkOrderProduct } from './work-order-products.entity';

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn()
  id_orden: number;

  @Column({ length: 50, unique: true })
  numero_orden: string; // Ej: "OT-2025-001"

  @Column({ type: 'date' })
  fecha_orden: Date;

  @Column({ length: 50 })
  numero_unidad: string; // Ej: "UNIDAD-001", "VEHICULO-A23"

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'en_proceso', 'completada', 'cancelada'],
    default: 'pendiente',
  })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  // ==================
  // RELACIONES
  // ==================

  // Usuario asignado (trabajador/técnico)
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'id_usuario_asignado' })
  usuario_asignado: UserEntity;

  @Column()
  id_usuario_asignado: string;

  // Usuario que revisa/supervisa
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'id_usuario_revisor' })
  usuario_revisor: UserEntity;

  @Column()
  id_usuario_revisor: string;

  // Productos utilizados en la orden
  @OneToMany(() => WorkOrderProduct, (wop) => wop.orden_trabajo, {
    cascade: true,
    eager: true,
  })
  productos: WorkOrderProduct[];

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}
