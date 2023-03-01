import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import Logger = require('bunyan');

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(private readonly logger: Logger) {}

  public debug(message: any, context?: string): void {
    this.logger.debug({ context }, message);
  }

  public error(message: any, errorObject?: string, context?: string): void {
    this.logger.error({ context, errorObject }, message);
  }

  public log(message: any, context?: string): void {
    this.logger.info({ context }, message);
  }

  public verbose(message: any, context?: string): void {
    this.logger.trace({ context }, message);
  }

  public warn(message: any, context?: string): void {
    this.logger.warn({ context }, message);
  }
}
