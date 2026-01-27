// import {
//   Controller,
//   Post,
//   Get,
//   Body,
//   Param,
//   Delete,
//   Patch,
//   UseInterceptors,
//   UploadedFile,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// import { ConfigurationService } from './configuration.service';
// import { CreateImageDto } from './dto/create-image.dto';
// import { UpdateImageDto } from './dto/update-image.dto';

// @Controller('configuration/images')
// export class ConfigurationController {
//   constructor(private readonly service: ConfigurationService) {}

//   @Post()
//   @UseInterceptors(
//     FileInterceptor('image', {
//       storage: diskStorage({
//         destination: './uploads/config',
//         filename: (_, file, cb) => {
//           const uniqueName =
//             Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(null, uniqueName + extname(file.originalname));
//         },
//       }),
//     }),
//   )
//   create(
//     @Body() dto: CreateImageDto,
//     @UploadedFile() file: Express.Multer.File,
//   ) {
//     const imageUrl = `/uploads/config/${file.filename}`;
//     return this.service.create(dto, imageUrl);
//   }

//   @Get(':section')
//   findBySection(@Param('section') section: string) {
//     return this.service.findBySection(section);
//   }

//   @Get()
//   findAll() {
//     return this.service.findAll();
//   }

// @Patch(':id')
// update(@Param('id') id: string, @Body() dto: UpdateImageDto) {
//   return this.service.update(id, dto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.service.remove(id);
// }

// }
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ConfigurationService } from './configuration.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('configuration/images')
export class ConfigurationController {
  constructor(
    private readonly service: ConfigurationService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =====================
  // CREATE (UPLOAD IMAGE)
  // =====================
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('La imagen es obligatoria');
    }

    // 1️⃣ Subir imagen a Cloudinary
    const uploadResult: any =
      await this.cloudinaryService.uploadImage(file);

    // 2️⃣ Guardar SOLO la URL
    return this.service.create(dto, uploadResult.secure_url);
  }

  // =====================
  // FIND BY SECTION
  // =====================
  @Get(':section')
  findBySection(@Param('section') section: string) {
    return this.service.findBySection(section);
  }

  // =====================
  // FIND ALL
  // =====================
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // =====================
  // UPDATE
  // =====================
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateImageDto,
  ) {
    return this.service.update(id, dto);
  }

  // =====================
  // DELETE
  // =====================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
