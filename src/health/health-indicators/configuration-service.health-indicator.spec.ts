import * as sinon from 'sinon';
import { expect } from 'chai';
import { TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ConfigurationServiceHealthIndicator } from './configuration-service.health-indicator';
import { CachingService } from '../../caching/caching.service';
import { HealthStatus } from '../constants/health.constants';

const sandbox = sinon.createSandbox();

describe('configuration health spec', () => {
  let module: TestingModule;
  let cachingService: CachingService;
  let configurationServiceHealthIndicator: ConfigurationServiceHealthIndicator;

  beforeEach(async () => {
    module = global.moduleFixture;
    configurationServiceHealthIndicator =
      module.get<ConfigurationServiceHealthIndicator>(
        ConfigurationServiceHealthIndicator,
      );
    cachingService = module.get<CachingService>(CachingService);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  it('configuration health should return ok', async function () {
    sandbox.stub(cachingService, 'getErrors').resolves([]);
    const res = await configurationServiceHealthIndicator.isHealthy('postgres');
    expect(res.postgres.status).to.eq(HealthStatus.OK);
    expect(res.postgres.statusCode).to.eq(HttpStatus.OK);
  });

  it('configuration health should return error critical', async function () {
    const errors = ['some crappy error'];
    sandbox.stub(cachingService, 'getErrors').resolves(errors);

    const res = await configurationServiceHealthIndicator.isHealthy('postgres');
    expect(res.postgres.status).to.eq(HealthStatus.CRITICAL);
    expect(res.postgres.statusCode).to.eq(HttpStatus.FAILED_DEPENDENCY);
    expect(res.postgres.lastFailure.stackTrace).to.contain(
      'Error: some crappy error',
    );
  });
});
