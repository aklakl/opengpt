import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { Inject, Injectable, HttpStatus } from '@nestjs/common';
import { ConfigurationService } from '../../config/configuration.service';
import { HealthStatus } from '../constants/health.constants';

@Injectable()
export class ConfigurationServiceHealthIndicator extends HealthIndicator {
  constructor(
    @Inject(ConfigurationService)
    private readonly configurationService: ConfigurationService,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    let isHealthy = false;
    const status = {
      resourceType: 'configuration',
      resourceName: 'harvest-genrate-configs',
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
      await this.configurationService.checkHealth();
      isHealthy = true;
    } catch (error) {
      status.status = HealthStatus.CRITICAL;
      status.statusCode = HttpStatus.FAILED_DEPENDENCY;
      status.lastFailure.timeStamp = new Date().toISOString();
      status.lastFailure.stackTrace = error.stack;
    }

    return this.getStatus(key, isHealthy, status);
  }
}
