import { Test } from '@nestjs/testing';
import { CachingService } from './caching.service';
import { CACHE_MANAGER } from '@nestjs/common';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('CachingService', function () {
  let cachingService: CachingService;
  let cacheManager;

  beforeEach(async function () {
    cacheManager = {
      get: sinon.stub().returns(undefined),
      set: sinon.stub().returnsArg(1),
    };
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: cacheManager,
        },
        CachingService,
      ],
    }).compile();

    cachingService = module.get<CachingService>(CachingService);
  });

  describe('set', function () {
    it('should call cache manager set and return value without options', async () => {
      const key = 'key';
      const value = 'value';
      const result = await cachingService.set(key, value);

      expect(result).to.eq(value);
      expect(cacheManager.set.calledOnce).to.eq(true);
      expect(cacheManager.set.firstCall.firstArg).to.eq(key);
      expect(cacheManager.set.firstCall.args[1]).to.eq(value);
    });

    it('should call cache manager set and return value with options', async () => {
      const key = 'key';
      const value = 'value';
      const options = { ttl: 5 };
      const result = await cachingService.setWithOptions(key, value, options);

      expect(result).to.eq(value);
      expect(cacheManager.set.calledOnce).to.eq(true);
      expect(cacheManager.set.firstCall.firstArg).to.eq(key);
      expect(cacheManager.set.firstCall.args[1]).to.eq(value);
      expect(cacheManager.set.firstCall.args[2]).to.eq(options);
    });
  });

  describe('get', function () {
    it('should call cache manager get', async function () {
      const key = 'key';
      const result = await cachingService.get(key);

      expect(result).to.eq(undefined);
      expect(cacheManager.get.calledOnce).to.eq(true);
      expect(cacheManager.get.firstCall.firstArg).to.eq(key);
      expect(cacheManager.get.firstCall.args.length).to.eq(1);
    });
  });

  describe('addError', function () {
    it('should add error when no errors', async function () {
      cacheManager.get.resolves([]);
      const error = new Error('Error');
      const serviceName = 'service';
      const result = await cachingService.addError(error, serviceName);

      expect(result.length).to.eq(1);
      expect(cacheManager.set.calledOnce).to.eq(true);
      expect(cacheManager.set.firstCall.firstArg).to.eq(`error${serviceName}`);
      expect(cacheManager.set.firstCall.args[1]).to.eq(result);
    });

    it('should add error when errors not empty', async function () {
      cacheManager.get.resolves(['old error']);
      const error = new Error('Error');
      const serviceName = 'service';
      const result = await cachingService.addError(error, serviceName);

      expect(result.length).to.eq(2);
      expect(cacheManager.set.calledOnce).to.eq(true);
      expect(cacheManager.set.firstCall.firstArg).to.eq(`error${serviceName}`);
      expect(cacheManager.set.firstCall.args[1]).to.eq(result);
    });
  });

  describe('getErrors', function () {
    it('should get errors', async function () {
      const key = 'key';
      const result = await cachingService.getErrors(key);

      expect(result).to.eq(undefined);
      expect(cacheManager.get.calledOnce).to.eq(true);
      expect(cacheManager.get.firstCall.firstArg).to.eq(`error${key}`);
      expect(cacheManager.get.firstCall.args.length).to.eq(1);
    });
  });
});
