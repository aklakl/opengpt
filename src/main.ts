import * as fs from 'fs';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/app.http.exception';
// import { checkCorsRules } from './helpers/cors-helper';
import { middleware as expressCtx } from 'express-ctx';
import * as util from 'util';
import { parseJwtToken } from './auth/helpers/jwt-helper';

const SWAGGER_ENVS = ['local', 'dev', 'staging'];

if (
  !process.env.EXPORT_SWAGGER &&
  process.env.NODE_ENV != 'test' &&
  process.env.DB_ENV != 'test' &&
  !process.env.NO_SSL_DB
) {
  //newrelicSetup();
}

let logger;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  //be careful use ValidationPipe refer:https://docs.nestjs.com/techniques/validation#stripping-properties
  //currently if we use ValidationPipe, the post body will be undefined
  //app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(expressCtx);

  app.use(helmet());

  logger = app.get(Logger);
  app.useLogger(logger); //Pengqi mention that log question, Just temporary disable here for tracking the logs
  app.enableCors();
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));
  // app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('openapi', {
    exclude: ['health', 'metrics'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const checkToken = async (req, res, next) => {
    if (req.headers?.authorization) {
      const token: string = req.headers?.authorization;
      try {
        const claims = parseJwtToken(token.split(' ')[1]);
        const exp = claims.body.exp;
        if (exp * 1000 < Date.now()) {
          return res.status(401).send('Access denied token expires');
        }
        const partner = claims.body.partner;
        if (['harvest_test_automation', 'vansh-test'].includes(partner)) {
          return next();
        }
      } catch (err) {
        return res.status(401).send('Access denied');
      }
    }
    res.status(401).send('Access denied');
  };
  if (!SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
    app.use(['/crusade/explorer', '/crusade/explorer-json'], checkToken);
  }
  const swaggerDocumentOptions = new DocumentBuilder()
    .setTitle('Harvest Nurture API')
    .setDescription('Nurture is one of the product in Harvest Product suite')
    .setVersion(process.env.npm_package_version)
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  if (process.env.EXPORT_SWAGGER) {
    logger.log(`Exporting swagger...`);
    fs.writeFileSync('./docs/swagger.json', JSON.stringify(document));
    return;
  }

  SwaggerModule.setup('crusade/explorer', app, document, {
    swaggerOptions: {
      filter: true,
      tryItOutEnabled: true,
    },
  });

  // const configService = app.get(ConfigurationService);
  // const deploymentConfig = configService.getDeploymentConfigs();

  // if (deploymentConfig.featureFlags.cors) {
  //   const allowList = deploymentConfig.cors.origin;
  //   app.enableCors({
  //     origin: function (origin, callback) {
  //       if (checkCorsRules(origin, allowList)) {
  //         callback(null, true);
  //         return;
  //       }
  //       callback(null, false);
  //     },
  //   });
  // }

  const port = process.env.HARVEST_CRUSADE_PORT || 3000;
  logger.log(`Listening on port ${port}`);

  await app.listen(port);
}

bootstrap();

process.on('uncaughtException', function (err, origin) {
  logger.log('UncaughtException Start');
  logger.error(
    'UncaughtException got crashed error =>' +
    util.inspect(err) +
    ' | Exception origin=>' +
    origin,
  );
  if (err['odbcErrors']) {
    for (const odbcError of err['odbcErrors']) {
      switch (odbcError.state) {
        case '08S01':
          logger.error('Error: failed to connect to Databricks database');
          break;
        default:
          logger.error(
            'Error: The databricks connection has an exception, Check here [https://learn.microsoft.com/en-us/sql/odbc/reference/appendixes/appendix-a-odbc-error-codes?view=sql-server-ver16] for possible errors',
          );
      }
    }
  }
  logger.error('Error: Crusade service could be in unstable state');
});
