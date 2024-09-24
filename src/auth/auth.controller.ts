import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    // Return user info along with the access token
    return this.authService.login(user);
  }

  @Post('seed-admin')
  async seedAdmin() {
    return this.authService.createAdmin();
  }
}
