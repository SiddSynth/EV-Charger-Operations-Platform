import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    const user = await this.usersService.findByEmail(body.email);

    if (!user || user.password !== body.password) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}