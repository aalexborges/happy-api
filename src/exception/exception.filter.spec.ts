import { BadRequestException } from '@nestjs/common';

import { ExceptionFilter } from './exception.filter';
import { AppException } from './exception.model';

describe('ExceptionFilter', () => {
  const filter = new ExceptionFilter();

  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });

  const host = {
    getType: jest.fn(() => 'http'),
    switchToHttp: jest.fn().mockReturnValue({ getResponse: jest.fn().mockReturnValue({ status }) }),
  };

  describe('.catch', () => {
    describe('when the type is not http', () => {
      it('returns the exception', () => {
        host.getType.mockReturnValueOnce('ws');

        const exception = new Error();
        const result = filter.catch(exception, <any>host);

        expect(result).toEqual(exception);
        expect(host.switchToHttp).not.toHaveBeenCalled();
        expect(json).not.toHaveBeenCalled();
      });
    });

    describe('when the type is http', () => {
      describe('when the exception is of type AppException', () => {
        it('returns the response correctly', () => {
          const exception = new AppException('INTERNAL_SERVER_ERROR');

          const result = filter.catch(exception, <any>host);

          expect(result).toBeUndefined();
          expect(status).toHaveBeenCalledWith(exception.getStatus());
          expect(json).toHaveBeenCalledWith(exception.getResponse());
        });
      });

      describe('when the exception is of type HttpException', () => {
        it('returns the response correctly', () => {
          const exception = new BadRequestException();

          const result = filter.catch(exception, <any>host);

          expect(result).toBeUndefined();
          expect(status).toHaveBeenCalledWith(exception.getStatus());
          expect(json).toHaveBeenCalledWith(exception.getResponse());
        });
      });

      describe('when the exception is unknown', () => {
        it('returns the response correctly', () => {
          const exception = new Error();
          const expectException = new AppException('INTERNAL_SERVER_ERROR');

          const result = filter.catch(exception, <any>host);

          expect(result).toBeUndefined();
          expect(status).toHaveBeenCalledWith(expectException.getStatus());
          expect(json).toHaveBeenCalledWith(expectException.getResponse());
        });
      });
    });
  });
});
