import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      console.log('User not found with email:', email);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const { password, ...result } = user.toJSON();
      return result;
    } else {
      console.log('Password is incorrect for user:', email);
      return null;
    }
  }

  // Handle login, setting the token in a secure cookie
  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    };
  }

}
