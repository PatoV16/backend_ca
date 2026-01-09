import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;

  @IsString()
  @MinLength(2, { message: 'El código prefijo debe tener al menos 2 caracteres' })
  @MaxLength(10, { message: 'El código prefijo no puede exceder 10 caracteres' })
  codigo_prefijo: string;
}