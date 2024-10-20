import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomMailerService } from './custom-mailer.service';
require('dotenv').config();

@Module({
  imports: [ConfigModule],
  providers: [CustomMailerService],
  exports: [CustomMailerService],
})
export class MailerCustomModule {}
