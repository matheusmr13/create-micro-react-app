import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import User from '../entity/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
