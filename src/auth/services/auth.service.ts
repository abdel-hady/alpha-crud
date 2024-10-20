import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
    private readonly logger: Logger,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      this.logger.warn(
        `Failed login attempt: user not found with email ${email}`,
      );
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      this.logger.log(`User validated successfully: ${email}`);
      const { password, ...result } = user.toJSON();
      return result;
    } else {
      this.logger.warn(
        `Failed login attempt: incorrect password for user ${email}`,
      );
      return null;
    }
  }

  // Handle login, setting the token in a secure cookie
  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    this.logger.log(`User logged in successfully: ${user.email}`);

    return {
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }
}
