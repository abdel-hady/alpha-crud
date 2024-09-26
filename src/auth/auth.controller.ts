import { Controller, Post, Body, NotFoundException, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Res({ passthrough: true }) response: Response) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const loginResult = await this.authService.login(user);

    response.cookie('access_token', loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      user: loginResult.user,
    };
  }

  @Post('seed-admin')
  async seedAdmin() {
    return this.authService.createAdmin();
  }
}
