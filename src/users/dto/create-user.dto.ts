// src/users/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsNotEmpty()
  dni: string;

  @IsNotEmpty()
  telefono: string;

  @IsEmail()
  correo: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  role: UserRole;

  @IsOptional()
  fotoPerfil?: string; // ✅ CLAVE
}
