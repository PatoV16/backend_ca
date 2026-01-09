import { 
  IsString, 
  IsDate, 
  IsArray, 
  IsNotEmpty, 
  ValidateNested, 
  IsNumber, 
  IsOptional, 
  IsEnum,
  IsUUID,
  Min,
  MaxLength 
} from 'class-validator';
import { Type } from 'class-transformer';

// ==================
// DTO PARA PRODUCTO EN LA ORDEN
// ==================
export class ProductoOrdenDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  id_producto: number;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @MaxLength(100)
  nombre_producto: string;

  @IsNumber()
  @Min(0.01, { message: 'La cantidad debe ser mayor a 0' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantidad: number;

  @IsString()
  @IsNotEmpty({ message: 'La unidad es obligatoria' })
  @MaxLength(20)
  unidad: string;

  @IsNumber()
  @Min(0, { message: 'El costo unitario no puede ser negativo' })
  @IsNotEmpty({ message: 'El costo unitario es obligatorio' })
  costo_unitario: number;
}

// ==================
// DTO PARA CREAR ORDEN DE TRABAJO
// ==================
export class CreateWorkOrderDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  fecha_orden: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  numero_unidad: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsUUID('4')
  id_usuario_asignado: string;

  @IsUUID('4')
  id_usuario_revisor: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductoOrdenDto)
  @IsNotEmpty()
  productos: ProductoOrdenDto[];

  @IsString()
  @IsOptional()
  observaciones?: string;
}


// ==================
// DTO PARA ACTUALIZAR ORDEN DE TRABAJO
// ==================
export class UpdateWorkOrderDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  fecha_orden?: Date;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  numero_unidad?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsUUID('4')
  @IsOptional()
  id_usuario_asignado?: string;

  @IsUUID('4')
  @IsOptional()
  id_usuario_revisor?: string;

  @IsEnum(['pendiente', 'en_proceso', 'completada', 'cancelada'])
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
