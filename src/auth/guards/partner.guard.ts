import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
import { METADATA_DISABLE_PARTNER_GUARD_KEY } from '../decorators/metadata/disable-partner-guard.decorator';
import { OktaClaims } from '../interfaces/claims.dto';
import { insecureDevelopment } from '../constants/insecure.development';

@Injectable()
export class PartnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    if (insecureDevelopment && insecureDevelopment()) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    const claims: OktaClaims = user?.claims;
    const disalbePartnerGuard = this.reflector.get<string[]>(
      METADATA_DISABLE_PARTNER_GUARD_KEY,
      context.getHandler(),
    );

    if (disalbePartnerGuard) {
      return true;
    }

    //TODO if the user role is admin, this check is not required, so return true if role is admin - not needed for the initial release as we will focus only on partnerAdmin

    if (!claims) {
      throw new UnauthorizedException();
    }

    const params = request.params;
    const queryPartner = params.partnerId || params.partner;

    const partner = claims.partner;
    if (queryPartner != partner) {
      throw new ForbiddenException();
    }

    return true;
  }
}
