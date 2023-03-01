import { LoggerModule } from 'nestjs-pino';

import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { loggerParamsFactory } from './common/helpers/logger-params-factory';
import { ConfigurationModule } from './config/configuration.module';
import { ConfigurationService } from './config/configuration.service';

import { OpengptModule } from './functions/opengpt/opengpt.module';
import { TypeOrmService } from './shared/typeorm/typeorm.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigurationService) => {
        return configService.getTypeOrmConfig();
      },
      inject: [ConfigurationService],
      useClass: TypeOrmService,
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: loggerParamsFactory,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    OpengptModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
