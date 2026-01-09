import { IsInt, IsPositive, IsOptional, IsString, IsNumber, MaxLength } from 'class-validator';

export class CreateEntryDto {
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  @IsPositive({ message: 'El ID del producto debe ser positivo' })
  id_producto: number;

  @IsInt({ message: 'El ID del proveedor debe ser un número entero' })
  @IsPositive({ message: 'El ID del proveedor debe ser positivo' })
  id_proveedor: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;

  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @IsPositive({ message: 'El precio unitario debe ser positivo' })
  precio_unitario: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  numero_factura?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observacion?: string;
}