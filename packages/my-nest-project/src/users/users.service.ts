import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entity/user';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { default as UserDTO } from './dto/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async findOne(id: string) {
    console.info(await this.usersRepository.createQueryBuilder().getMany());
    return await this.usersRepository.findOne(id);
  }

  async update(id: string, userDto: UserDTO) {
    let user = await this.usersRepository.findOne(id);
    if (!user) user = new User(id);
    User.merge(user, userDto);
    const newUser = await user.save();
    return newUser;
  }
}
