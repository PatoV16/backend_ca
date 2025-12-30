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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ConfigurationService } from './configuration.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Controller('configuration/images')
export class ConfigurationController {
  constructor(private readonly service: ConfigurationService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/config',
        filename: (_, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/config/${file.filename}`;
    return this.service.create(dto, imageUrl);
  }

  @Get(':section')
  findBySection(@Param('section') section: string) {
    return this.service.findBySection(section);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateImageDto) {
  return this.service.update(id, dto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.service.remove(id);
}

}
