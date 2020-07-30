import { Controller, Get, Param, Body, Put } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import User from './dto/user';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id/extra')
  async findOne(@Param('id') id: string) {
    console.info(id);
    const loggedUser = await this.usersService.findOne(id);
    console.info(loggedUser);
    // return loggedUser;
    return loggedUser;
  }

  @Put(':id/extra')
  async update(@Param('id') id: string, @Body() userDto: User) {
    const loggedUser = await this.usersService.update(id, userDto);
    return loggedUser;
  }
}
