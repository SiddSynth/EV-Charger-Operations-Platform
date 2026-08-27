import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  create(name: string, email: string, password: string, role: string) {
    const user = this.userRepository.create({
      name,
      email,
      password,
      role,
      status: 'Active',
    });

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async toggleStatus(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    return this.userRepository.save(user);
  }
}