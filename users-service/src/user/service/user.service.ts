import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Messages } from 'src/common/constants/response-messages';
import { Repository } from 'typeorm';
import { UserRole } from '../constant';
import { User } from '../entity/user.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(email: string, password: string, role: UserRole = UserRole.USER) {
    try {
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new RpcException({ statusCode: 400, message: Messages.EXISTING_EMAIL });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({ email, password: hashedPassword, role });
      return this.userRepository.save(user);
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: Messages.EXCEPTION_INTERNAL_SERVER_ERROR});
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new RpcException({ statusCode: 404, message: Messages.EXCEPTION_NOT_FOUND });
      }
      return user;
      
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: Messages.EXCEPTION_INTERNAL_SERVER_ERROR});
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new RpcException({ statusCode: 404, message: Messages.EXCEPTION_NOT_FOUND });
      }
      return user;
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: Messages.EXCEPTION_INTERNAL_SERVER_ERROR});
    }
  }

  async findUserByEmailWithPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email }, select: ['id', 'email', 'password', 'role'] });
      if (!user) {
        throw new RpcException({ statusCode: 404, message: Messages.EXCEPTION_NOT_FOUND });
      }
      return user;
    } catch (error) {
      throw new RpcException({ statusCode: 500, message: Messages.EXCEPTION_INTERNAL_SERVER_ERROR});
    }
  }
}