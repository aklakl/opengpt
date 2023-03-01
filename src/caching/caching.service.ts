import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CachingService {
  private readonly ERROR_KEY: string = 'error';

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: any): Promise<void> {
    return await this.cacheManager.set(key, value);
  }

  async setWithOptions(key: string, value: any, options: any): Promise<void> {
    return await this.cacheManager.set(key, value, options);
  }

  async get(key: string): Promise<any> {
    return this.cacheManager.get(key);
  }

  async getErrors(serviceName = ''): Promise<any[]> {
    return this.get(`${this.ERROR_KEY}${serviceName}`);
  }

  async addError(error: any, serviceName = ''): Promise<any[]> {
    let errors: any[] = await this.getErrors();
    if (!errors) {
      errors = [];
    }
    errors.push(error);
    const key = `${this.ERROR_KEY}${serviceName}`;
    await this.cacheManager.set(key, errors);
    return errors;
  }
}
