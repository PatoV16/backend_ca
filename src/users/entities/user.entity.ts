import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 80 })
  nombre: string;

  @Column({ length: 80 })
  apellido: string;

  @Column({ length: 20 })
  dni: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ unique: true })
  correo: string;

  @Column({length: 100})
  role: UserRole;

  // 🔐 NUNCA devolver al frontend
  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  fotoPerfil?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  ultimaActualizacion: Date;
}
