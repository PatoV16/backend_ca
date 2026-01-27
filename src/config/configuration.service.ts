
import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigImage } from './entities/config-image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    @InjectRepository(ConfigImage)
    private readonly imageRepo: Repository<ConfigImage>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // =====================
  // UPLOAD & CREATE (NUEVO - USA ESTE)
  // =====================
  async uploadAndCreate(
    dto: CreateImageDto,
    file: Express.Multer.File,
  ) {
    this.logger.log('📤 Subiendo imagen a Cloudinary...');

    // 1️⃣ Subir a Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(file);

    this.logger.log(`✅ Imagen subida a Cloudinary: ${uploadResult.secure_url}`);

    // 2️⃣ Guardar en BD
    const image = this.imageRepo.create({
      ...dto,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    const savedImage = await this.imageRepo.save(image);

    this.logger.log(`✅ Imagen guardada en BD con ID: ${savedImage.id}`);
    
    return savedImage;
  }

  // =====================
  // CREATE (MANUAL - solo si ya tienes la URL)
  // =====================
  async create(
    dto: CreateImageDto,
    imageUrl: string,
    publicId?: string,
  ) {
    this.logger.log('📥 Creando nueva imagen');

    const image = this.imageRepo.create({
      ...dto,
      imageUrl,
      publicId,
    });

    const savedImage = await this.imageRepo.save(image);

    this.logger.log(`✅ Imagen guardada con ID: ${savedImage.id}`);
    return savedImage;
  }

  // =====================
  // FIND BY SECTION
  // =====================
  async findBySection(section: string) {
    return this.imageRepo.find({
      where: { section, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  // =====================
  // FIND ALL
  // =====================
  async findAll() {
    return this.imageRepo.find();
  }

  // =====================
  // UPDATE
  // =====================
  async update(id: string, dto: UpdateImageDto) {
    const result = await this.imageRepo.update(id, dto);

    if (!result.affected) {
      throw new NotFoundException('Imagen no encontrada');
    }

    return result;
  }

  // =====================
  // UPDATE WITH IMAGE (NUEVO)
  // =====================
  async updateWithImage(
    id: string,
    dto: UpdateImageDto,
    file: Express.Multer.File,
  ) {
    this.logger.log(`🔄 Actualizando imagen ID: ${id}`);

    const image = await this.imageRepo.findOne({ where: { id } });

    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }

    // 1️⃣ Borrar imagen antigua de Cloudinary
    if (image.publicId) {
      await this.cloudinaryService.deleteImage(image.publicId);
      this.logger.log('🗑️ Imagen antigua eliminada de Cloudinary');
    }

    // 2️⃣ Subir nueva imagen
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    this.logger.log(`✅ Nueva imagen subida: ${uploadResult.secure_url}`);

    // 3️⃣ Actualizar en BD
    await this.imageRepo.update(id, {
      ...dto,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });

    return this.imageRepo.findOne({ where: { id } });
  }

  // =====================
  // REMOVE (BORRA EN CLOUDINARY Y BD)
  // =====================
  async remove(id: string) {
    this.logger.warn(`🗑️ Eliminando imagen ID: ${id}`);

    const image = await this.imageRepo.findOne({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException('Imagen no encontrada');
    }

    // 1️⃣ Borrar de Cloudinary
    if (image.publicId) {
      await this.cloudinaryService.deleteImage(image.publicId);
      this.logger.log('✅ Imagen eliminada de Cloudinary');
    }

    // 2️⃣ Borrar de BD
    await this.imageRepo.remove(image);

    this.logger.log('✅ Imagen eliminada correctamente de la BD');
  }
}