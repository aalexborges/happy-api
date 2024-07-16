import 'dotenv/config';

import { Expose, plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsPositive, IsString, validateSync } from 'class-validator';

class EnvSchema {
  @Expose()
  @IsEnum(['development', 'test', 'production'])
  NODE_ENV: 'development' | 'test' | 'production' = 'development';

  @Expose()
  @IsString()
  ENV_NAME: string = 'development';

  @IsInt()
  @Expose()
  @IsPositive()
  PORT: number = 3000;

  @Expose()
  get isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }

  @Expose()
  get isTest(): boolean {
    return this.NODE_ENV === 'test';
  }

  @Expose()
  get isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }
}

const Env = plainToInstance(EnvSchema, process.env, {
  exposeDefaultValues: true,
  enableImplicitConversion: true,
  excludeExtraneousValues: true,
});

const errors = validateSync(Env);
if (errors.length) throw errors;

export { Env };
