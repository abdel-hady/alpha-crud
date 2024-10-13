import { Module } from '@nestjs/common';
import { MyLogger } from 'src/services/logger.service';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
