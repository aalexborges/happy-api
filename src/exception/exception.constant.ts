import { HttpStatus } from '@nestjs/common';

export const APP_EXCEPTIONS = {
  INTERNAL_SERVER_ERROR: {
    message: 'Internal server error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  PASSWORDS_DO_NOT_MATCH: {
    message: 'Unprocessable entity',
    description: 'Passwords do not match',
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  },
} as const satisfies { [key: string]: { message: string; status: number | HttpStatus; description?: string } };

export type AppExceptionKeys = keyof typeof APP_EXCEPTIONS;
