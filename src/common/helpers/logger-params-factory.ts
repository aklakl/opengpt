import { ConfigurationService } from '../../config/configuration.service';
import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { Params } from 'nestjs-pino';
import _ from 'lodash';
import { RequestMethod } from '@nestjs/common';

export function genReqId(req: IncomingMessage) {
  const requestIdHeader = req.headers['x-request-id'];
  if (requestIdHeader) {
    return requestIdHeader;
  }

  const amznTraceIdHeader = req.headers['x-amzn-trace-id'];
  if (amznTraceIdHeader) {
    return amznTraceIdHeader;
  }

  return uuidv4();
}

export async function loggerParamsFactory(
  config: ConfigurationService,
): Promise<Params> {
  const { logger } = config
    ? config.getDeploymentConfigs()
    : {
        logger: {
          name: 'harvest-crusade',
          level: 'debug',
          transport: {
            target: 'pino-pretty',
          },
        },
      };

  if (process.env.NODE_ENV === 'test') {
    logger.level = 'fatal';
  }

  logger.level = process.env.LOG_LEVEL || logger.level;

  // nestjs-pino mutates the original logger.transport object
  const clonedLoggerTransport =
    logger.transport && _.cloneDeep(logger.transport);

  return {
    pinoHttp: {
      name: logger.name,
      level: logger.level,
      transport: clonedLoggerTransport,
      redact: [
        'req.headers.authorization',
        'req.headers["x-real-ip"]',
        'req.headers["x-forwarded-for"]',
        'req.headers["x-original-forwarded-for"]',
        'req.remoteAddress',
        'req.remotePort',
        'method.args[*].profile.*',
        'method.args[*].email',
        'method.args[*].credentials.*',
        'config.headers.authorization',
        'err.config.headers.Authorization',
        'err.config.params',
        'err.config.data',
      ],
      genReqId,
    },
    exclude: [{ method: RequestMethod.GET, path: 'health' }],
  };
}
