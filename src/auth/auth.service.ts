import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
  ) { }

  // Validate user email and password
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      console.log('User not found with email:', email);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const { password, ...result } = user.toJSON(); // Avoid returning password
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

  async createAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingUser = await this.userModel.findOne({
      where: { email: adminEmail },
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.userModel.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }
  }
}
