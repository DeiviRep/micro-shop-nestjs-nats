// src/auth/auth.service.ts
import { Injectable, Inject, NotFoundException, BadRequestException, HttpException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, role: string) {
    const userResponse = await firstValueFrom(this.userClient.send('CREATE_USER', { email, password, role }));
    const token = this.jwtService.sign({ id: userResponse.id, role: userResponse.role });
    return { access_token: token };
  }  

  async login(email: string, password: string) {
      const user = await firstValueFrom(this.userClient.send('GET_USER_BY_EMAIL_WITH_PASSWORD', email));
      if (!user) {
        throw new NotFoundException('test error User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }

      const token = this.jwtService.sign({ id: user.id, role: user.role });
      return { access_token: token };
  }
}