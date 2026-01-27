// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
// } from 'typeorm';

// @Entity('posts')
// export class Post {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   userName: string;

//   @Column('text')
//   content: string;

//   @Column({ default: 0 })
//   likes: number;

//   @Column({ default: 0 })
//   comments: number;

//   @Column('simple-array', { nullable: true })
//   imageUrls: string[];

//   @CreateDateColumn()
//   createdAt: Date;
// }
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  comments: number;

  // URLs públicas (para mostrar)
  @Column('simple-array', { nullable: true })
  imageUrls: string[];

  // 👇 NECESARIO PARA CLOUDINARY (borrar / reemplazar)
  @Column('simple-array', { nullable: true })
  imagePublicIds: string[];

  @CreateDateColumn()
  createdAt: Date;
}
