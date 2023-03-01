import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

let insecureDevelopment;
try {
  insecureDevelopment = require('../../../test/test-insecure-development');
} catch (e) {}

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  authenticate(req) {
    if (insecureDevelopment && insecureDevelopment()) {
      this._verify(undefined, (err, user, info) => this.success(user, info));
      return;
    }
    const result = super.authenticate(req);
    return result;
  }

  async validate(token: string) {
    const user = await this.authService.validateUser(token);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
