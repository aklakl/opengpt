import { HttpException, HttpStatus } from '@nestjs/common';

export const throwHttpExceptionWithBadRequest = function (
  message: string,
): any {
  console.log('throwHttpExceptionWithBadRequest =>>' + JSON.stringify(message));
  throw new HttpException(message, HttpStatus.BAD_REQUEST);
};
