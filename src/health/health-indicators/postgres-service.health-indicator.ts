import { Injectable, HttpStatus } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { HealthStatus } from '../constants/health.constants';
import { ConfigurationService } from '../../config/configuration.service';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresServiceHealthIndicator extends HealthIndicator {
  constructor(
    private readonly config: ConfigurationService,
    private dataSource: DataSource,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    let isHealthy;
    const status = {
      resourceType: 'postgresql',
      resourceName: 'local database',
      configurationKey: `see eksConfig`,
      lastFailure: {
        timeStamp: '',
        stackTrace: null,
      },
      status: HealthStatus.OK,
      statusCode: HttpStatus.OK,
      updatedAt: new Date(),
    };

    try {
      await this.dataSource.query('select 1');
      isHealthy = true;
    } catch (error) {
      status.status = HealthStatus.CRITICAL;
      status.statusCode = HttpStatus.FAILED_DEPENDENCY;
      status.lastFailure.timeStamp = new Date().toISOString();
      status.lastFailure.stackTrace =
        error.stack || 'postgresql is not working';
    }
    return this.getStatus(key, isHealthy, status);
  }
}
