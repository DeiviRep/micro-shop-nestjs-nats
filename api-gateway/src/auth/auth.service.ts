// src/auth/auth.service.ts
import { Injectable, Inject, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

// Define el tipo de User esperado desde users-service
interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role: string) {
    try {
      const userResponse = await firstValueFrom(this.userClient.send('CREATE_USER', { email, password, role }));
      const token = this.jwtService.sign({ id: userResponse.id, role: userResponse.role });
      return { access_token: token };
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await firstValueFrom(this.userClient.send('GET_USER_BY_EMAIL', email));
      if (!user) {
          throw new Error('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          throw new Error('Invalid password');
      }
      if (!user) throw new NotFoundException(user);
      const token = this.jwtService.sign({ id: user.id, role: user.role });
      return { access_token: token };
    } catch (error) {
        throw new NotFoundException(error)
    }
  }
}