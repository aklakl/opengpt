import { Cache, caching } from 'cache-manager';

export function cacheFactory(): Cache {
  return caching({ store: 'memory', ttl: 10000 });
}
