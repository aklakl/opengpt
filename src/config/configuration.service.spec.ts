import { expect } from 'chai';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import { ConfigService } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import * as sinon from 'sinon';
import { CachingService } from '../caching/caching.service';
import { ConfigurationService } from './configuration.service';

describe('Configuration Service spec', function () {
  let configurationService: ConfigurationService;
  let configService: ConfigService;
  let cachingService: CachingService;
  const sandbox = sinon.createSandbox();

  beforeEach(async function () {
    const module: TestingModule = global.moduleFixture;
    configurationService =
      module.get<ConfigurationService>(ConfigurationService);
    configService = module.get<ConfigService>(ConfigService);
    cachingService = module.get<CachingService>(CachingService);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('getConfigValue', function () {
    it('should call config service get', function () {
      const value = 'value';
      const key = 'key';
      const configServiceGetStub = sandbox
        .stub(configService, 'get')
        .returns(value);

      const result = configurationService.getConfigValue(key);

      expect(result).to.eq(value);
      expect(configServiceGetStub.callCount).to.eq(1);
      expect(configServiceGetStub.firstCall.firstArg).to.eq(key);
    });
  });

  describe('creteDeploymentConfigOptions', function () {
    it('should return deployment config options', function () {
      const region = 'region';
      const environment = 'environment';
      const stub = sandbox
        .stub(configurationService, 'getConfigValue')
        .returns({ region, environment });

      const result = configurationService.createDeploymentConfigOptions();
      expect(result.region).to.eq(region);
      expect(result.environment).to.eq(environment);
      expect(stub.firstCall.firstArg).to.eq('environment');
    });
  });

  describe('getDeploymentConfigPath', function () {
    it('should return path', () => {
      const region = 'region';
      const environment = 'environment';
      sandbox
        .stub(configurationService, 'createDeploymentConfigOptions')
        .returns({ region, environment });

      const result = configurationService.getDeploymentConfigPath();
      expect(result).to.eq(`${region}/${environment}`);
    });
  });

  describe('getDeploymentConfigs', function () {
    it('should return path', () => {
      const region = 'region';
      const environment = 'environment';
      sandbox
        .stub(configurationService, 'createDeploymentConfigOptions')
        .returns({
          region,
          environment,
        });
      const configServiceStub = sandbox
        .stub(configService, 'get')
        .resolves(undefined);

      configurationService.getDeploymentConfigs();

      expect(configServiceStub.firstCall.firstArg).to.eq(
        `${region}/${environment}`,
      );
    });
  });

  describe('saveValue', function () {
    it('should call caching service set method', async function () {
      const cachingServiceSetStub = sandbox.stub(cachingService, 'set');
      const key = 'key';
      const value = 'value';

      await configurationService.saveValue(key, value);

      expect(cachingServiceSetStub.callCount).to.eq(1);
      expect(cachingServiceSetStub.firstCall.firstArg).to.eq(key);
      expect(cachingServiceSetStub.firstCall.args[1]).to.eq(value);
    });
  });

  describe('getSavedValue', function () {
    it('should call caching service get method', async function () {
      const value = 'value';
      const cachingServiceSetStub = sandbox
        .stub(cachingService, 'get')
        .resolves(value);
      const key = 'key';

      const result = await configurationService.getSavedValue(key);

      expect(result).to.eq(value);
      expect(cachingServiceSetStub.callCount).to.eq(1);
      expect(cachingServiceSetStub.firstCall.firstArg).to.eq(key);
    });
  });

  describe('schemaValidation', function () {
    it('should do nothing if valid schema', async function () {
      const addErrorSpy = sandbox.spy(cachingService, 'addError');

      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'integer' },
        },
        required: ['foo'],
      };

      const data = {
        foo: 100,
      };

      const result = await configurationService.schemaValidation({
        schemaFile: { schema },
        jsonFile: data,
        fileName: 'test123',
      });

      expect(result).to.eq(undefined);
      expect(addErrorSpy.callCount).to.eq(0);
    });

    it('should call add error caching service when error', async function () {
      const addErrorSpy = sandbox.spy(cachingService, 'addError');
      const schema = {
        type: 'object',
        properties: {
          foo: { type: 'integer' },
        },
        required: ['foo'],
      };

      const data = {
        bar: 100,
      };

      const result = await configurationService.schemaValidation({
        schemaFile: { schema },
        jsonFile: data,
        fileName: 'test123',
      });

      expect(result).to.eq(undefined);
      expect(addErrorSpy.callCount).to.eq(1);
      expect(addErrorSpy.firstCall.args.length).to.eq(2);
    });
  });
});
