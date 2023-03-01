import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CachingModule } from '../caching/caching.module';
import { ConfigurationService } from './configuration.service';

import { config } from './environmentConfig/default.config';
import deploymentConfig from './deploymentConfig/config';
import { CachingService } from '../caching/caching.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config, deploymentConfig],
    }),
    CachingModule,
  ],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
@Global()
export class ConfigurationModule {}
