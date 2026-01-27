import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    CloudinaryModule, // 👈 importante para inyectar CloudinaryService
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
