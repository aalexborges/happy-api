import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';

import { APP_EXCEPTIONS, AppExceptionKeys } from './exception.constant';

export class AppException {
  readonly type: AppExceptionKeys;
  readonly status: number | HttpStatus;
  readonly details: string[];
  readonly message: string;
  readonly options?: HttpExceptionOptions;
  readonly description?: string;

  constructor(key: AppExceptionKeys, details: string[] = [], options?: HttpExceptionOptions) {
    const exception = APP_EXCEPTIONS[key];

    this.status = exception.status;
    this.message = exception.message;
    this.description = exception['description'];
    this.options = options;
    this.details = details;
    this.type = key;

    Object.setPrototypeOf(this, AppException.prototype);
  }

  getStatus() {
    return this.status;
  }

  getResponse() {
    return {
      message: this.message,
      description: this.description,
      status: this.status,
      type: this.type,
      details: this.details,
    };
  }
}
