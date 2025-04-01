import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';

@Controller('auth')
export class AuthController extends AbstractController{
  constructor(private authService: AuthService) {
    super();
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; role: string }) {
    const result = await  this.authService.register(body.email, body.password, body.role);
    return this.success(result);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);
    return this.success(result)
  }
}