import { IsNumber, IsString, IsUUID } from 'class-validator';
import * as dotenv from 'dotenv';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

dotenv.config()
@Entity({ name: 'products', schema: process.env.DB_SCHEMA_PRODUCTS })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column('float')
  @IsNumber()
  price: number;

  @Column()
  @IsUUID()
  userId: string;
}
