import { HttpStatus } from '@nestjs/common';

export const APP_EXCEPTIONS = {
  INTERNAL_SERVER_ERROR: {
    message: 'Internal server error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
} as const satisfies { [key: string]: { message: string; status: number | HttpStatus; description?: string } };

export type AppExceptionKeys = keyof typeof APP_EXCEPTIONS;
