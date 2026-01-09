import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('salidas')
export class Exit {
  @PrimaryGeneratedColumn()
  id_salida: number;

  @ManyToOne(() => Product, product => product.salidas)
  @JoinColumn({ name: 'id_producto' })
  producto: Product;

  @Column()
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costo_unitario: number; // NUEVO: Para valorización de salida

  @Column()
  motivo: string; // Venta, Merma, Devolución, Ajuste, etc.

  @Column({ nullable: true })
  referencia: string; // Número de pedido, factura, etc.

  @Column({ nullable: true })
  observacion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_salida: Date;
}