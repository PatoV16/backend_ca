// import {
//   Controller,
//   Post as HttpPost,
//   Get,
//   Patch,
//   Delete,
//   Param,
//   Body,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// import { PostsService } from './posts.service';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

// @Controller('posts')
// export class PostsController {
//   constructor(private readonly postsService: PostsService) {}

//   // CREATE
//   @HttpPost()
//   @UseInterceptors(
//     FilesInterceptor('images', 10, {
//       storage: diskStorage({
//         destination: './uploads',
//         filename: (_, file, cb) => {
//           const name = Date.now() + '-' + Math.random().toString(36).substring(7);
//           cb(null, `${name}${extname(file.originalname)}`);
//         },
//       }),
//     }),
//   )
//   create(
//     @Body() dto: CreatePostDto,
//     @UploadedFiles() files: Express.Multer.File[],
//   ) {
//     const imageUrls = files?.map(f => `/uploads/${f.filename}`) ?? [];
//     return this.postsService.create(dto, imageUrls);
//   }

//   // READ ALL
//   @Get()
//   findAll() {
//     return this.postsService.findAll();
//   }

//   // READ ONE
//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     return this.postsService.findOne(+id);
//   }

//   // UPDATE GENERAL
//   @Patch(':id')
//   update(
//     @Param('id') id: number,
//     @Body() dto: UpdatePostDto,
//   ) {
//     return this.postsService.update(+id, dto);
//   }

//   // LIKE
//   @Patch(':id/like')
//   like(@Param('id') id: number) {
//     return this.postsService.like(+id);
//   }

//   // COMMENT
//   @Patch(':id/comment')
//   comment(@Param('id') id: number) {
//     return this.postsService.addComment(+id);
//   }

//   // DELETE
//   @Delete(':id')
//   remove(@Param('id') id: number) {
//     return this.postsService.remove(+id);
//   }
// }
import {
  Controller,
  Post as HttpPost,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =====================
  // CREATE POST
  // =====================
  @HttpPost()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];
    let imagePublicIds: string[] = [];

    if (files?.length) {
      const uploads = await Promise.all(
        files.map(file => this.cloudinaryService.uploadImage(file)),
      );

      imageUrls = uploads.map(u => u.secure_url);
      imagePublicIds = uploads.map(u => u.public_id);
    }

    return this.postsService.create(dto, imageUrls, imagePublicIds);
  }

  // =====================
  // READ ALL POSTS
  // =====================
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // =====================
  // READ ONE POST
  // =====================
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(+id);
  }

  // =====================
  // UPDATE POST
  // =====================
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(+id, dto);
  }

  // =====================
  // LIKE
  // =====================
  @Patch(':id/like')
  like(@Param('id') id: number) {
    return this.postsService.like(+id);
  }

  // =====================
  // COMMENT
  // =====================
  @Patch(':id/comment')
  comment(@Param('id') id: number) {
    return this.postsService.addComment(+id);
  }

  // =====================
  // DELETE POST
  // =====================
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(+id);
  }
}
