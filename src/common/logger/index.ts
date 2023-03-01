export * from './logger.module';
export * from './utils/logger.utils';
export * from './logger.service';

import * as Bunyan from 'bunyan';
export { Bunyan };

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
