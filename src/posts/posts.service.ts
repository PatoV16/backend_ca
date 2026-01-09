import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  // CREATE
  async create(dto: CreatePostDto, imageUrls: string[] = []): Promise<Post> {
    this.logger.log('Creando nuevo post');
    this.logger.debug(`Datos recibidos: ${JSON.stringify(dto)}`);
    this.logger.debug(`Imágenes: ${imageUrls.length}`);

    const post = this.postRepo.create({
      ...dto,
      imageUrls,
      likes: 0,
      comments: 0,
    });

    const savedPost = await this.postRepo.save(post);
    this.logger.log(`Post creado con ID: ${savedPost.id}`);

    return savedPost;
  }

  // READ ALL
  async findAll(): Promise<Post[]> {
    this.logger.log('Obteniendo todos los posts');

    const posts = await this.postRepo.find({
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Posts encontrados: ${posts.length}`);
    return posts;
  }

  // READ ONE
  async findOne(id: number): Promise<Post> {
    this.logger.log(`Buscando post con ID: ${id}`);

    const post = await this.postRepo.findOneBy({ id });

    if (!post) {
      this.logger.warn(`Post no encontrado (ID: ${id})`);
      throw new NotFoundException('Post no encontrado');
    }

    this.logger.log(`Post encontrado (ID: ${id})`);
    return post;
  }

  // UPDATE
  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    this.logger.log(`Actualizando post ID: ${id}`);
    this.logger.debug(`Datos de actualización: ${JSON.stringify(dto)}`);

    const post = await this.findOne(id);

    Object.assign(post, dto);
    const updatedPost = await this.postRepo.save(post);

    this.logger.log(`Post actualizado correctamente (ID: ${id})`);
    return updatedPost;
  }

  // LIKE +1
  async like(id: number): Promise<Post> {
    this.logger.log(`Agregando like al post ID: ${id}`);

    const post = await this.findOne(id);
    post.likes += 1;

    const updatedPost = await this.postRepo.save(post);
    this.logger.debug(`Likes actuales: ${updatedPost.likes}`);

    return updatedPost;
  }

  // COMMENT +1
  async addComment(id: number): Promise<Post> {
    this.logger.log(`Agregando comentario al post ID: ${id}`);

    const post = await this.findOne(id);
    post.comments += 1;

    const updatedPost = await this.postRepo.save(post);
    this.logger.debug(`Comentarios actuales: ${updatedPost.comments}`);

    return updatedPost;
  }

  // DELETE
  async remove(id: number): Promise<void> {
    this.logger.log(`Eliminando post ID: ${id}`);

    const post = await this.findOne(id);
    await this.postRepo.remove(post);

    this.logger.log(`Post eliminado correctamente (ID: ${id})`);
  }
}
