import { IsInt, IsPositive, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateExitDto {
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  @IsPositive({ message: 'El ID del producto debe ser positivo' })
  id_producto: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;

  @IsString()
  @MinLength(3, { message: 'El motivo debe tener al menos 3 caracteres' })
  @MaxLength(100)
  motivo: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  referencia?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;
}