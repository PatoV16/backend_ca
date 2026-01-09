import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100)
  nombre: string;

  @IsString()
  @Matches(/^\d{10,13}$/, { message: 'El RUC debe tener entre 10 y 13 dígitos' })
  ruc: string;

  @IsString()
  @Matches(/^\d{7,15}$/, { message: 'El teléfono debe contener entre 7 y 15 dígitos' })
  telefono: string;

  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @IsString()
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  @MaxLength(255)
  direccion: string;
}