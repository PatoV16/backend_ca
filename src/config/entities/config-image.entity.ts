import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('config_images')
export class ConfigImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  section: string; // gallery, hero, services, etc

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
