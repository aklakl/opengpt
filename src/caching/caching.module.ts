import { CacheModule, Module } from '@nestjs/common';
import { CachingService } from './caching.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 0,
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class CachingModule {}
