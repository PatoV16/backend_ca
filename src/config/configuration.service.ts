import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigImage } from './entities/config-image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    @InjectRepository(ConfigImage)
    private readonly imageRepo: Repository<ConfigImage>,
  ) {}

  // =====================
  // CREATE
  // =====================
  async create(dto: CreateImageDto, imageUrl: string) {
    this.logger.log('📥 Creando nueva imagen');
    this.logger.debug(`DTO recibido: ${JSON.stringify(dto)}`);
    this.logger.debug(`Image URL: ${imageUrl}`);

    const image = this.imageRepo.create({
      ...dto,
      imageUrl,
    });

    const savedImage = await this.imageRepo.save(image);

    this.logger.log(`✅ Imagen guardada con ID: ${savedImage.id}`);

    return savedImage;
  }

  // =====================
  // FIND BY SECTION
  // =====================
  async findBySection(section: string) {
    this.logger.log(`🔍 Buscando imágenes activas para sección: ${section}`);

    const images = await this.imageRepo.find({
      where: { section, isActive: true },
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`📦 Imágenes encontradas: ${images.length}`);

    images.forEach((img) =>
      this.logger.debug(`➡️ ${img.id} | ${img.imageUrl}`),
    );

    return images;
  }

  // =====================
  // FIND ALL
  // =====================
  async findAll() {
    this.logger.log('📄 Obteniendo todas las imágenes');

    const images = await this.imageRepo.find();

    this.logger.log(`📦 Total imágenes: ${images.length}`);

    return images;
  }

  // =====================
  // UPDATE
  // =====================
  async update(id: string, dto: UpdateImageDto) {
    this.logger.log(`✏️ Actualizando imagen ID: ${id}`);
    this.logger.debug(`DTO update: ${JSON.stringify(dto)}`);

    const result = await this.imageRepo.update(id, dto);

    this.logger.log(
      `✅ Filas afectadas: ${result.affected ?? 0}`,
    );

    return result;
  }

  // =====================
  // REMOVE
  // =====================
  async remove(id: string) {
    this.logger.warn(`🗑️ Eliminando imagen ID: ${id}`);

    const result = await this.imageRepo.delete(id);

    this.logger.log(
      `✅ Filas eliminadas: ${result.affected ?? 0}`,
    );

    return result;
  }
}
