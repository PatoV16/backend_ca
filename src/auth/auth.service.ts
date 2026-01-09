import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(correo: string, password: string) {
    const user = await this.usersService.validateUser(correo, password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      
      role: user.role,
      correo: user.correo,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
