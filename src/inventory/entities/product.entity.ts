import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Unit } from './unit.entity';
import { Provider } from './provider.entity';
import { Entry } from './entry.entity';
import { Exit } from './exit.entity';

@Entity('productos')
export class Product {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: 0 })
  stock_actual: number;

  @Column()
  stock_minimo: number;

  @Column({ nullable: true })
  stock_maximo: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costo_promedio: number;

  @Column({ default: true })
  estado: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  /* =========================
     RELACIONES
     ========================= */

  @ManyToOne(() => Category, category => category.productos, { eager: true })
  @JoinColumn({ name: 'id_categoria' })
  categoria: Category;

  @ManyToOne(() => Unit, unit => unit.productos, { eager: true })
  @JoinColumn({ name: 'id_unidad' })
  unidad: Unit;

  // ✅ NUEVO: PROVEEDOR
  @ManyToOne(() => Provider, provider => provider.productos, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Provider;

  @OneToMany(() => Entry, entry => entry.producto)
  entradas: Entry[];

  @OneToMany(() => Exit, exit => exit.producto)
  salidas: Exit[];
}
