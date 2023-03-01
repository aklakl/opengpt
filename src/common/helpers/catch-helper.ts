import { HttpException, HttpStatus } from '@nestjs/common';
import { RealizationError } from './errors';

export function Catch(_target, _key, descriptor): any {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args): Promise<any> {
    try {
      return await originalMethod.apply(this, args);
    } catch (err) {
      if (err.name === 'EntityNotFoundError') {
        this.logger.debug({ err }, `${originalMethod.name} -> NotFound`);
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      if (err.name == 'HttpException') {
        throw err;
      }
      if (err instanceof RealizationError) {
        this.logger.error({ err }, `${originalMethod.name} error`);
        const message = err.userFacing ? err.message : 'Internal Server Error';
        if (err.retryable) {
          throw new HttpException(
            {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: `${message} - please retry.`,
              reference: err.reference,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        } else {
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: `${message}`,
              reference: err.reference,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      this.logger.error({ err }, `${originalMethod.name} error`);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Internal Server Error - please retry.`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };
}
