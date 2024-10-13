import { Module } from '@nestjs/common';
import { ProtectedController } from '../ controllers/protected.controller';

@Module({
  controllers: [ProtectedController],
})
export class ProtectedModule {}
