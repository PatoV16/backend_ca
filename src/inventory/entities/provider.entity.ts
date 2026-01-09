import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Entry } from './entry.entity';
import { Product } from './product.entity';

@Entity('proveedores')
export class Provider {
  @PrimaryGeneratedColumn()
  id_proveedor: number;

  @Column()
  nombre: string;

  @Column()
  ruc: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column()
  direccion: string;

  @Column({ default: true })
  estado: boolean;

  @OneToMany(() => Entry, entry => entry.proveedor)
  entradas: Entry[];

  // ✅ NUEVO
  @OneToMany(() => Product, product => product.proveedor)
  productos: Product[];
}
