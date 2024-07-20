import { ArgumentsHost, ExceptionFilter as BaseExceptionFilter, Catch, HttpException, Logger } from '@nestjs/common';
import type { Response } from 'express';

import { AppException } from './exception.model';

@Catch()
export class ExceptionFilter<T> implements BaseExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name);

  catch(exception: T, host: ArgumentsHost) {
    const type = host.getType();

    if (type !== 'http') return exception;

    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    if (exception instanceof AppException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    this.logger.error(exception);

    const internalError = new AppException('INTERNAL_SERVER_ERROR');
    response.status(internalError.getStatus()).json(internalError.getResponse());
  }
}
