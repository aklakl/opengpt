import { HttpStatus, Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { isAxiosError } from '@nestjs/terminus/dist/utils';
import axios from 'axios';
import { ConfigurationService } from '../../config/configuration.service';
import { HealthStatus } from '../constants/health.constants';

@Injectable()
export class ExternalServiceHealthIndicator extends HealthIndicator {
  constructor(private readonly configurationService: ConfigurationService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    let isHealthy;
    const status = {
      resourceType: 'externalService',
      resourceName: 'external service',
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
      const externalServiceConfig =
        await this.configurationService.getConfigValue('externalService');
      const resonse = await axios.get(
        `${externalServiceConfig.generate.apiEndpoint}/`,
      );
      if (resonse.data != 'opengpt-harvest-generate api') {
        status.status = HealthStatus.CRITICAL;
        status.statusCode = HttpStatus.FAILED_DEPENDENCY;
        status.lastFailure.timeStamp = new Date().toISOString();
        status.lastFailure.stackTrace = resonse.data;
      } else {
        isHealthy = true;
      }
    } catch (error) {
      status.status = HealthStatus.CRITICAL;
      status.statusCode = HttpStatus.FAILED_DEPENDENCY;
      status.lastFailure.timeStamp = new Date().toISOString();
      if (isAxiosError(error)) {
        status.lastFailure.stackTrace = error?.response?.data || error.stack;
      } else {
        status.lastFailure.stackTrace = error.stack;
      }
    }
    return this.getStatus(key, isHealthy, status);
  }
}
