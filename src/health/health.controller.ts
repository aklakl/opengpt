import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Res, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import {
  PostgresServiceHealthIndicator,
  ConfigurationServiceHealthIndicator,
} from './health-indicators';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import * as _ from 'lodash';
import { Health } from './dto/health.dto';
import { HealthStatus } from './constants/health.constants';
import { ExternalServiceHealthIndicator } from './health-indicators/external-service.health-indicator';
import { DatabricksServiceHealthIndicator } from './health-indicators/databricks-service.health-indicator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private health: HealthCheckService,
    private postgreSqlHealthIndicator: PostgresServiceHealthIndicator,
    private configurationHealthIndicator: ConfigurationServiceHealthIndicator,
    private externalServiceHealthIndicator: ExternalServiceHealthIndicator,
    private databricksServiceHealthIndicator: DatabricksServiceHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Display health of this service and dependant services health',
  })
  @ApiResponse({
    status: 200,
    type: Health,
    description: 'Success.',
  })
  @HealthCheck()
  async check(@Res() response: Response): Promise<Health> {
    const healthCheck = await this.health.check([
      async () => this.configurationHealthIndicator.isHealthy('configuration'),
      async () => this.postgreSqlHealthIndicator.isHealthy('postgres'),
      async () =>
        this.externalServiceHealthIndicator.isHealthy('externalService'),
      async () =>
        this.databricksServiceHealthIndicator.isHealthy('databricksService'),
    ]);

    const connections = Object.keys(healthCheck.details).map(
      key => healthCheck.details[key],
    );
    const healthy = _.uniq(
      connections.map((n: { status: string }) => n.status),
    );

    const finalStatus =
      healthy.length === 1 && healthy[0] === 'ok'
        ? HealthStatus.OK
        : HealthStatus.CRITICAL;
    const responseObj = {
      status: finalStatus,
      statusCode:
        finalStatus == HealthStatus.OK
          ? HttpStatus.OK
          : HttpStatus.FAILED_DEPENDENCY,
      connections,
      apiVersion: process.env.npm_package_version,
    };
    if (responseObj.statusCode != HttpStatus.OK) {
      this.logger.error(
        'HealthController.check | HealthCheck got error = ' +
          JSON.stringify(responseObj),
      );
    }
    response.status(responseObj.statusCode).send(responseObj);
    return responseObj;
  }
}
