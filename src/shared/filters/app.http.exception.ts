import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpAdapterHost } from '@nestjs/core';
import * as commonUtils from '../../functions/util/commonUtils';
import { CustomDiagnostics } from '../../functions/constant/error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    let responseBody = undefined;
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    try {
      const httpStatusCode =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      const response = ctx.getResponse<Response>();
      const message = exception.message;

      responseBody = {
        status: 'error',
        statusCode: httpStatusCode,
        timestamp: new Date().toISOString(),
        message: message,
      };
      this.logger.error(
        'HttpExceptionFilter catch execption=>' + JSON.stringify(responseBody),
      );
      response.status(httpStatusCode).json(responseBody);
    } catch (e) {
      this.logger.error(exception.message, exception.stack);
      responseBody = {
        status: 'error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        message: CustomDiagnostics.InternalError,
      };
      httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return responseBody;
  }
}
