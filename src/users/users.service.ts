import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // =====================
  // CREATE USER
  // =====================
  async create(
    dto: CreateUserDto,
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    this.logger.log(`🟢 Creando usuario | correo=${dto.correo}`);

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      dni: dto.dni,
      telefono: dto.telefono,
      correo: dto.correo,
      role: dto.role,
      passwordHash,
      fotoPerfil: dto.fotoPerfil,
      activo: true,
    });

    const savedUser = await this.userRepository.save(user);

    this.logger.log(`✅ Usuario creado | id=${savedUser.id}`);

    const { passwordHash: _, ...safeUser } = savedUser;
    return safeUser;
  }

  // =====================
  // FIND ALL
  // =====================
  async findAll(): Promise<Omit<UserEntity, 'passwordHash'>[]> {
    this.logger.log(`📋 Listando usuarios`);

    const users = await this.userRepository.find();

    return users.map(({ passwordHash, ...user }) => user);
  }

  // =====================
  // FIND ONE
  // =====================
  async findOne(
    id: string,
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    this.logger.log(`🔍 Buscando usuario | id=${id}`);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      this.logger.warn(`⚠️ Usuario no encontrado | id=${id}`);
      throw new NotFoundException('Usuario no encontrado');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // =====================
  // FIND BY EMAIL (INTERNAL)
  // =====================
  private async findByEmail(
    correo: string,
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { correo },
    });
  }

  // =====================
  // LOGIN / VALIDATE USER
  // =====================
  async validateUser(
    correo: string,
    password: string,
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    this.logger.log(`🔐 Intento de login | correo=${correo}`);

    const user = await this.findByEmail(correo);

    if (!user) {
      this.logger.warn(`❌ Login fallido | usuario no existe`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activo) {
      this.logger.warn(`❌ Login bloqueado | usuario inactivo`);
      throw new UnauthorizedException('Usuario inactivo');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      this.logger.warn(`❌ Login fallido | password incorrecto`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    this.logger.log(`✅ Login exitoso | id=${user.id}`);

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // =====================
  // UPDATE
  // =====================
  async update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<Omit<UserEntity, 'passwordHash'>> {
    this.logger.log(`✏️ Actualizando usuario | id=${id}`);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    Object.assign(user, dto);

    const updatedUser = await this.userRepository.save(user);

    const { passwordHash, ...safeUser } = updatedUser;
    return safeUser;
  }

  // =====================
  // DELETE
  // =====================
  async remove(id: string): Promise<void> {
    this.logger.log(`🗑️ Eliminando usuario | id=${id}`);

    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.logger.log(`❌ Usuario eliminado | id=${id}`);
  }
}
