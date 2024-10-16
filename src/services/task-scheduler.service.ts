import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CustomMailerService } from './custom-mailer.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskSchedulerService {
  private readonly logger = new Logger(TaskSchedulerService.name);
  constructor(
    private readonly mailerService: CustomMailerService,
    private readonly configService: ConfigService,
  ) {}
  @Cron(CronExpression.EVERY_12_HOURS)
  async handleCron() {
    this.logger.log('Task executed: Logging a message every 5 minutes');
    const email = this.configService.get('MAIL_TO');
    const subject = 'Scheduled Email: Sent every 5 minutes';
    const context =
      'This is a periodic email sent every 5 minutes by the task scheduler.';

    try {
      await this.mailerService.sendEmail(email, subject, context);
      this.logger.log(`Email successfully sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending scheduled email', error.stack);
    }
  }
}
