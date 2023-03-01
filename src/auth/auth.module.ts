import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ConfigurationService } from '../config/configuration.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt-guard';
import { HttpStrategy } from './strategies/http.strategy';
import { BasicHttpStrategy } from './strategies/basic.strategy';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
// import { PartnerRbacModule } from '../partner-rbac/partner-rbac.module';

const authProvider = {
  provide: 'AuthProvider',
  useFactory: (configService: ConfigurationService) =>
    new JwtGuard(configService),
  inject: [ConfigurationService],
};
const passportModule = PassportModule.register({
  defaultStrategy: ['bearer'],
  property: 'session',
});

@Module({
  imports: [
    passportModule,
    HttpModule,
    // PartnerRbacModule
  ],
  controllers: [AuthController],
  providers: [AuthService, HttpStrategy, BasicHttpStrategy, authProvider],
  exports: [passportModule, AuthService],
})
export class AuthModule {}
