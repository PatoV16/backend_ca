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
import { WorkOrder } from './work-order.entity';
@Entity('work_order_products')
export class WorkOrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkOrder, (wo) => wo.productos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_orden_trabajo' })
  orden_trabajo: WorkOrder;

  @Column()
  id_orden_trabajo: number;

  @Column()
  id_producto: number;

  @Column({ length: 100 })
  nombre_producto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ length: 20 })
  unidad: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_total: number;
}