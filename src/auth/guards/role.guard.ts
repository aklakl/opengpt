import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
import { METADATA_ROLES_KEY } from '../decorators/metadata/access-roles.decorator';
import { OktaClaims } from '../interfaces/claims.dto';
import { insecureDevelopment } from '../constants/insecure.development';

@Injectable()
export class RoleGuard implements CanActivate {
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

    if (!claims || !claims.harvest_role) {
      throw new UnauthorizedException();
    }

    const functionRoles = this.reflector.get<string[]>(
      METADATA_ROLES_KEY,
      context.getHandler(),
    );

    const controllerRoles = this.reflector.get<string[]>(
      METADATA_ROLES_KEY,
      context.getClass(),
    );

    //Check harvest role
    const roles = functionRoles || controllerRoles;

    if (!roles || roles.length == 0) {
      throw new ForbiddenException();
    } else {
      //check roles
      if (!roles.includes(claims.harvest_role)) {
        throw new ForbiddenException();
      }
    }

    return true;
  }
}
