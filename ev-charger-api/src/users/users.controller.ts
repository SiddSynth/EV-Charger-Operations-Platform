import { Body, Controller, Get, Post, Put, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post('auth/login')
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

  @Get('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Post('users')
  create(
    @Body()
    body: {
      name: string;
      email: string;
      role: string;
    },
  ) {
    const defaultPassword = 'user123';
    return this.usersService.create(
      body.name,
      body.email,
      defaultPassword,
      body.role,
    );
  }

  @Put('users/:id/status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleStatus(id);
  }
}