import * as dotenv from 'dotenv';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserRole } from '../constant';
import { IsEmail, IsEnum } from 'class-validator';

dotenv.config()
@Entity({ name: 'users', schema: process.env.DB_SCHEMA_SHOPS })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}
