import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
import { AuthGuard as NestAuthGurad } from '@nestjs/passport';
import { OktaClaims } from '../interfaces/claims.dto';
import { AccessRole } from '../constants/access-role.enum';
import { insecureDevelopment } from '../constants/insecure.development';
import { ContextProvider } from '../../providers/context.provider';

@Injectable()
export class AuthGuard extends NestAuthGurad('bearer') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    if (insecureDevelopment && insecureDevelopment()) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, ctx: ExecutionContext) {
    if (err) {
      throw err || new UnauthorizedException();
    }

    const req = ctx.switchToHttp().getRequest();
    req.user = user;

    const claims: OktaClaims = user?.claims;

    //Granular suite access
    const access: string[] = claims.harvest_granular_suite_access;
    if (!access || !access.includes('crusade')) {
      throw new ForbiddenException();
    }

    if (AccessRole.PartnerAdmin == claims.harvest_role && !claims.partner) {
      //user role is partnerAdmin and partner is undefined or empty
      throw new ForbiddenException();
    }

    ContextProvider.setAuthUser(claims);
    return user;
  }
}
