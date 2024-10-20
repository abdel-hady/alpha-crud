import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { Public } from 'src/guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const loginResult = await this.authService.login(user);

    return {
      user: loginResult.user,
      token: loginResult.token,
    };
  }
}
