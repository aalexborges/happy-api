import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { repl } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { Env } from './app.env';
import { AppModule } from './app.module';

async function bootstrap() {
  const server = await repl(AppModule);
  const dataSource: DataSource = server.context.get(DataSource);

  for (const entityMetadata of dataSource?.entityMetadatas || []) {
    const repository = dataSource.getRepository(entityMetadata.target);
    const entityName = entityMetadata.targetName.replace('Entity', '');

    server.context[entityName] = repository;
  }

  server.context.Env = Env;

  server.setupHistory(join(tmpdir(), '.happy_api_repl_history'), err => {
    if (err) console.error(err);
  });
}

bootstrap();
