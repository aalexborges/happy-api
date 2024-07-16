import { DataSource } from 'typeorm';

import { DATABASE_CONFIG_BY_ENV } from './database.config';

export default new DataSource({ ...DATABASE_CONFIG_BY_ENV, logging: true });
