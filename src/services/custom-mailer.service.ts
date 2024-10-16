import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
require('dotenv').config();

@Injectable()
export class CustomMailerService {
  private readonly logger = new Logger(CustomMailerService.name);
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: +this.configService.get('MAIL_PORT'),
      secure: this.configService.get('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, context: string) {
    try {
      const mailOptions = {
        from: this.configService.get('MAIL_FROM'),
        to,
        subject,
        text: `Your email content goes here with dynamic data: ${context}`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Message sent: ${info.messageId} to ${to}`);
    } catch (error) {
      this.logger.error(`Error sending email to ${to}`, error.stack);
    }
  }
}
