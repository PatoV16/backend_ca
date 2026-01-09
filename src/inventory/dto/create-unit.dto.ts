import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50)
  nombre: string;

  @IsString()
  @MinLength(1, { message: 'La abreviatura debe tener al menos 1 caracter' })
  @MaxLength(10, { message: 'La abreviatura no puede exceder 10 caracteres' })
  abreviatura: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}