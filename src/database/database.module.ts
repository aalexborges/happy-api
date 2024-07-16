import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DATABASE_CONFIG_BY_ENV } from './database.config';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(DATABASE_CONFIG_BY_ENV)],
})
export class DatabaseModule {}
