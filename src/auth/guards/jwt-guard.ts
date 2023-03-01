import { IAuthProvider } from '../interfaces/auth.provider';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import JwtVerifier from '@okta/jwt-verifier';
import { ConfigurationService } from '../../config/configuration.service';
import { parseJwtToken } from '../helpers/jwt-helper';

let insecureDevelopment;
try {
  insecureDevelopment = require('../../../test/test-insecure-development');
} catch (e) {}

interface IJwtVerifiers {
  [key: string]: {
    verifier: JwtVerifier;
    clients: [string];
  };
}

@Injectable()
export class JwtGuard implements IAuthProvider {
  verifiers: IJwtVerifiers;

  constructor(
    @Inject(ConfigurationService)
    private readonly configurationService: ConfigurationService,
  ) {}

  async onModuleInit() {
    const { authServer, allowedClients } =
      this.configurationService.getDeploymentConfigs().oktaSso;
    this.verifiers = {};
    this.verifiers[authServer] = {
      verifier: new JwtVerifier({ issuer: authServer }),
      clients: allowedClients,
    };
  }

  async verifyToken(token: string) {
    try {
      if (insecureDevelopment && insecureDevelopment()) {
        return true;
      }

      const jwt = parseJwtToken(token);
      if (!Object.prototype.hasOwnProperty.call(this.verifiers, jwt.body.iss)) {
        throw new Error(`Unsupported issuer ${jwt.body.iss}`);
      }

      const { verifier, clients } = this.verifiers[jwt.body.iss];
      return await verifier.verifyAccessToken(token, [...clients]);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
