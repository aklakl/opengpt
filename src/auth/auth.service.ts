import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IAuthProvider } from './interfaces/auth.provider';
import * as basicAuth from 'express-basic-auth';
import { ConfigurationService } from '../config/configuration.service';
// import { PartnerRbacService } from '../partner-rbac/partner-rbac.service';
import { v4 } from 'uuid';

let insecureDevelopment;
try {
  insecureDevelopment = require('../../test/test-insecure-development');
} catch (e) {}

@Injectable()
export class AuthService implements OnModuleInit {
  private serviceAuthUsername = v4();
  private serviceAuthPassword = v4();

  constructor(
    @Inject('AuthProvider') private readonly authProvider: IAuthProvider,
    @Inject(ConfigurationService)
    private readonly configurationService: ConfigurationService, // @Inject(PartnerRbacService) // private readonly partnerRbacService: PartnerRbacService,
  ) {}

  async validateUser(token: string): Promise<any> {
    if (insecureDevelopment && insecureDevelopment()) {
      return true;
    }
    const user = await this.authProvider.verifyToken(token);

    return user;
  }

  public getAccessibleSubordinatePartnerIds(partnerId: string): any {
    // return this.partnerRbacService.getAccessiblePartners(partnerId);
    return partnerId;
  }

  validateMircoServiceCreds(username: string, password: string): boolean {
    if (insecureDevelopment && insecureDevelopment()) {
      return true;
    }
    return (
      basicAuth.safeCompare(username, this.serviceAuthUsername) &&
      basicAuth.safeCompare(password, this.serviceAuthPassword)
    );
  }

  async onModuleInit() {
    const { authUsername, authPassword } =
      this.configurationService.getCrusadeConfig();
    this.serviceAuthUsername = authUsername;
    this.serviceAuthPassword = authPassword;
  }
}
