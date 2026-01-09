import { UserRole } from '../enums/user-role.enum';


export class UserResponseDto {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  correo: string;
  role: UserRole;
  fotoPerfil?: string;
  activo: boolean;
}
