import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { ExceptionModule } from './exception/exception.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [DatabaseModule, ExceptionModule, HealthModule],
})
export class AppModule {}
