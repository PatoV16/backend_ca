import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Provider } from './provider.entity';

@Entity('entradas')
export class Entry {
  @PrimaryGeneratedColumn()
  id_entrada: number;

  @ManyToOne(() => Product, product => product.entradas)
  @JoinColumn({ name: 'id_producto' })
  producto: Product;

  @ManyToOne(() => Provider, provider => provider.entradas)
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Provider;

  @Column()
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number; // NUEVO: cantidad * precio_unitario

  @Column({ nullable: true })
  numero_factura: string; // NUEVO: Para trazabilidad

  @Column({ nullable: true })
  observacion: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_entrada: Date;
}