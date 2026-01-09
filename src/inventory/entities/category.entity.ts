import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('categorias')
export class Category {
  @PrimaryGeneratedColumn()
  id_categoria: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column()
  codigo_prefijo: string;

  @Column({ default: true })
  estado: boolean;

  @OneToMany(() => Product, product => product.categoria)
  productos: Product[];
}
