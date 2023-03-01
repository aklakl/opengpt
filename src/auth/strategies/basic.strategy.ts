import { BasicStrategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

let insecureDevelopment;
try {
  insecureDevelopment = require('../../../test/test-insecure-development');
} catch (e) {}

@Injectable()
export class BasicHttpStrategy extends PassportStrategy(BasicStrategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  authenticate(req) {
    if (insecureDevelopment && insecureDevelopment()) {
      this._verify(undefined, (err, user, info) => this.success(user, info));
      return;
    }
    return super.authenticate(req);
  }

  validate(username: string, password: string): any {
    const isValidUser = this.authService.validateMircoServiceCreds(
      username,
      password,
    );
    if (!isValidUser) {
      throw new UnauthorizedException();
    }
    return isValidUser;
  }
}
