import { join } from 'node:path';

import type { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Env } from '@/app.env';
import { loadYAML } from '@/utils/load-yaml';

import { DatabaseLogger } from './database.logger';

type DatabaseYAML = {
  default: DataSourceOptions;
  development: DataSourceOptions;
  test: DataSourceOptions;
  production: DataSourceOptions;
};

const DATABASE_CONFIG = loadYAML<DatabaseYAML>(join(__dirname, '..', '..', 'config', 'database.yaml'), {
  SnakeNamingStrategy,
  Env,
});

const DATABASE_BASE_CONFIG = { logger: new DatabaseLogger() } satisfies Partial<DataSourceOptions>;

export const DATABASE_CONFIG_BY_ENV = Env.isDevelopment
  ? { ...DATABASE_BASE_CONFIG, ...DATABASE_CONFIG.development }
  : Env.isTest
    ? { ...DATABASE_BASE_CONFIG, ...DATABASE_CONFIG.test }
    : { ...DATABASE_BASE_CONFIG, ...DATABASE_CONFIG.production };
