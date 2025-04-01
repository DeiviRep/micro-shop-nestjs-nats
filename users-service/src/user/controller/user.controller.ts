import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from '../service/user.service';
import { UserRole } from '../constant';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('CREATE_USER')
  async createUser(@Payload() dataDto: CreateUserDto) {
    return this.userService.createUser(dataDto);
  }

  @MessagePattern('FIND_USER_BY_ID')
  async findUserById(@Payload() data: { id: string }) {
    return this.userService.findUserById(data.id);
  }

  @MessagePattern('FIND_USER_BY_EMAIL')
    async findUserByEmail(@Payload() email: string) {
        return await this.userService.findUserByEmail(email);
  }

  @MessagePattern('GET_USER_BY_EMAIL_WITH_PASSWORD')
  async getUserByEmailWithPassword(@Payload() email: string) {
      return await this.userService.findUserByEmailWithPassword(email);
  }
}