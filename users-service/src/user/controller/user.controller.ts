import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../service/user.service';
import { UserRole } from '../constant';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('CREATE_USER')
  async createUser(data: { email: string; password: string; role: string }) {
    return this.userService.createUser(data.email, data.password, data.role as UserRole);
  }

  @MessagePattern('FIND_USER_BY_ID')
  async findUserById(data: { id: string }) {
    return this.userService.findUserById(data.id);
  }

  @MessagePattern('FIND_USER_BY_EMAIL')
    async findUserByEmail(email: string) {
        return await this.userService.findUserByEmail(email);
  }

  @MessagePattern('GET_USER_BY_EMAIL_WITH_PASSWORD')
  async getUserByEmailWithPassword(email: string) {
      return await this.userService.findUserByEmailWithPassword(email);
  }
}