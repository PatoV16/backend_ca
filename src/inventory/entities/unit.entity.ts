import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('unidades')
export class Unit {
  @PrimaryGeneratedColumn()
  id_unidad: number;

  @Column()
  nombre: string; // Ej: Kilogramo, Litro, Unidad, Caja, etc.

  @Column()
  abreviatura: string; // Ej: Kg, L, Un, Cj

  @Column({ nullable: true })
  descripcion: string;

  @Column({ default: true })
  estado: boolean;

  @OneToMany(() => Product, product => product.unidad)
  productos: Product[];
}