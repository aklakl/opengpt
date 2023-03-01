import * as sinon from 'sinon';
import { expect } from 'chai';
import { DataSource } from 'typeorm';
import { TestingModule } from '@nestjs/testing';

import { PostgresServiceHealthIndicator } from './postgres-service.health-indicator';
import { HttpStatus } from '@nestjs/common';
import { HealthStatus } from '../constants/health.constants';

const sandbox = sinon.createSandbox();

describe('postgres health spec', () => {
  let module: TestingModule;
  let postgresServiceHealthIndicator: PostgresServiceHealthIndicator;
  let dataSource: DataSource;

  beforeEach(async () => {
    module = global.moduleFixture;
    postgresServiceHealthIndicator = module.get<PostgresServiceHealthIndicator>(
      PostgresServiceHealthIndicator,
    );
    dataSource = module.get(DataSource);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  it('should return ok when there is a working connection', async function () {
    const res = await postgresServiceHealthIndicator.isHealthy('postgres');
    expect(res.postgres.status).to.eq(HealthStatus.OK);
    expect(res.postgres.statusCode).to.eq(HttpStatus.OK);
  });

  it('should return error critical if there is no working connection', async function () {
    const error = new Error('Error: postgres is not available');
    await sandbox.stub(dataSource, 'query').rejects(error);
    const res = await postgresServiceHealthIndicator.isHealthy('postgres');
    expect(res.postgres.status).to.eq(HealthStatus.CRITICAL);
    expect(res.postgres.statusCode).to.eq(HttpStatus.FAILED_DEPENDENCY);
    expect(res.postgres.lastFailure.stackTrace).to.contain(
      'Error: postgres is not available',
    );
  });
});
