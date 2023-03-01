import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Gauge, register } from 'prom-client';
import { Request, Response } from 'express';
import { HealthCheckService } from '@nestjs/terminus';
import { PostgresServiceHealthIndicator } from '../../health/health-indicators/postgres-service.health-indicator';
import { ConfigurationServiceHealthIndicator } from '../../health/health-indicators/configuration-service.health-indicator';
import * as _ from 'lodash';

const g = new Gauge({
  name: 'healthy',
  help: 'Metric that shows if harvest-crusade API layer is healthy or not.',
  labelNames: ['health'],
});

@ApiTags('Metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    private health: HealthCheckService,
    private postgreSqlHealthIndicator: PostgresServiceHealthIndicator,
    private configurationHealthIndicator: ConfigurationServiceHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get healthy status',
  })
  @ApiResponse({
    status: 200,
    type: 'object',
    description: 'Success',
  })
  async getMetrics(@Req() req: Request, @Res() res: Response): Promise<any> {
    // to be changed after health service is implemented
    const healthCheck = await this.health.check([
      () => this.configurationHealthIndicator.isHealthy('configuration'),
      () => this.postgreSqlHealthIndicator.isHealthy('postgres'),
    ]);

    const connections = Object.keys(healthCheck.details).map(
      key => healthCheck.details[key],
    );
    const healthy = _.uniq(
      connections.map((n: { status: string }) => n.status),
    );
    // --------------------------------------------------
    const health = healthy.length === 1 && healthy[0] === 'ok';

    if (health) {
      g.set(1);
    } else {
      g.set(0);
    }

    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  }
}
