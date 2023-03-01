import { CachingService } from './caching.service';
import { cacheFactory } from './cache.factory';

export function cachingServiceFactory(): CachingService {
  const cache = cacheFactory();
  return new CachingService(cache);
}
