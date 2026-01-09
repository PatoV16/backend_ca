import { IsInt, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  nombre: string;

  @IsOptional()
  descripcion?: string;

  @IsInt()
  stock_minimo: number;

  @IsOptional()
  @IsInt()
  stock_maximo?: number;

  @IsNumber()
  precio_unitario: number;

  @IsInt()
  id_categoria: number;

  @IsInt()
  id_unidad: number;

  // ✅ NUEVO
  @IsInt()
  id_proveedor: number;
}
