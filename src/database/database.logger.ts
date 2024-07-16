import { Logger as NestLogger } from '@nestjs/common';
import { Logger as TypeOrmLogger } from 'typeorm';

type BuildLogOptions = {
  parameters?: unknown[];
  time?: number;
  error?: string | Error;
};

export class DatabaseLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('SQL');

  logQuery(query: string, parameters?: unknown[]) {
    this.logger.debug(this.buildLog(query, { parameters }));
  }

  logQueryError(error: string, query: string, parameters?: unknown[]) {
    this.logger.error(this.buildLog(query, { error, parameters }));
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]) {
    this.logger.warn(this.buildLog(query, { time, parameters }));
  }

  logSchemaBuild(message: string) {
    this.logger.log(message);
  }

  logMigration(message: string) {
    this.logger.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log') return this.logger.log(message);
    if (level === 'warn') return this.logger.warn(message);
    // if (level === 'info') return this.logger.debug(message);
  }

  private buildLog(query: string, { error, parameters, time }: BuildLogOptions = {}) {
    let message = `QUERY: ${query}`;

    if (time) message = `TIME: ${time}ms -- ${message}`;
    if (parameters) message = `${message} -- PARAMETERS: ${this.stringifyParameters(parameters)}`;
    if (error) message = `${message} -- ERROR: ${error instanceof Error ? error.message : error}`;

    return message;
  }

  private stringifyParameters(parameters?: unknown[]) {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}
