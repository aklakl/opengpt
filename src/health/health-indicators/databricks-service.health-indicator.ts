import { Injectable, HttpStatus } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { HealthStatus } from '../constants/health.constants';

@Injectable()
export class DatabricksServiceHealthIndicator extends HealthIndicator {
  constructor(private readonly) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    let isHealthy;
    const status = {
      resourceType: 'databricks',
      resourceName: 'databricks',
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
      //isHealthy = await this.odbcService.isActive();
      if (!isHealthy) {
        status.status = HealthStatus.CRITICAL;
        status.statusCode = HttpStatus.FAILED_DEPENDENCY;
        status.lastFailure.timeStamp = new Date().toISOString();
        status.lastFailure.stackTrace = 'databricks is not working';
      }
    } catch (error) {
      status.status = HealthStatus.CRITICAL;
      status.statusCode = HttpStatus.FAILED_DEPENDENCY;
      status.lastFailure.timeStamp = new Date().toISOString();
      status.lastFailure.stackTrace = error.stack;
    }
    return this.getStatus(key, isHealthy, status);
  }
}
