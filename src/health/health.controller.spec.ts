import { expect } from 'chai';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { TestingModule } from '@nestjs/testing';

import { ConfigurationServiceHealthIndicator } from './health-indicators/configuration-service.health-indicator';
import { PostgresServiceHealthIndicator } from './health-indicators/postgres-service.health-indicator';
import { HealthController } from './health.controller';
import { Response } from 'express';

const sandbox = createSandbox();

describe('Health Controller', () => {
  const healthCheckTemplate = {
    status: '',
    resourceType: '',
    resourceName: '',
    configurationKey: null,
    lastFailure: {
      timeStamp: '',
      stackTrace: null,
    },
    updatedAt: '2022-03-03T13:06:40.164Z',
  };

  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = global.moduleFixture;
    controller = await module.resolve<HealthController>(HealthController);

    sandbox
      .stub(PostgresServiceHealthIndicator.prototype, 'isHealthy')
      .resolves({
        postgres: {
          ...healthCheckTemplate,
          status: 'ok',
          resorceType: 'postgresql',
          resourceName: 'postgres',
        },
      });

    sandbox
      .stub(ConfigurationServiceHealthIndicator.prototype, 'isHealthy')
      .resolves({
        configuration: {
          ...healthCheckTemplate,
          status: 'ok',
          resorceType: 'postgresql',
          resourceName: 'postgres',
        },
      });
  });

  afterEach(() => {
    sandbox.restore();
  });
  //build the fake response, make sure the code called has status and send mothod, and make sure passing test case
  const response: any = {};
  //response = response || {};
  response['status'] = () => {
    const res: any = {};
    res['send'] = () => {
      let resNest: Response<any, Record<string, any>>;
      return resNest;
    };
    return res;
  };
  context('when all services are available', () => {
    it('should return an object with a status OK', async () => {
      console.log('response=>' + JSON.stringify(response));
      expect(await controller.check(response)).to.have.deep.property(
        'status',
        'ok',
      );
    });
  });

  context('when one or more services are not healthy', () => {
    it('should return an object with a status critical if postgresql is not healthy', async () => {
      const isHealthy: SinonStubbedInstance =
        PostgresServiceHealthIndicator.prototype.isHealthy;
      isHealthy.resolves({
        postgres: {
          ...healthCheckTemplate,
          status: 'critical',
          resorceType: 'postgresql',
          resourceName: 'postgres',
        },
      });

      expect(await controller.check(response)).to.have.deep.property(
        'status',
        'critical',
      );
    });
    ``;

    it('should return an object with a status critical if configuration is not healthy', async () => {
      const isHealthy: SinonStubbedInstance =
        ConfigurationServiceHealthIndicator.prototype.isHealthy;
      isHealthy.resolves({
        configuration: {
          ...healthCheckTemplate,
          status: 'critical',
          resorceType: 'postgresql',
          resourceName: 'postgres',
        },
      });

      expect(await controller.check(response)).to.have.deep.property(
        'status',
        'critical',
      );
    });
  });
});
