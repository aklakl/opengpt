import { SetMetadata } from '@nestjs/common';
import { AccessRole } from '../../constants/access-role.enum';

export const METADATA_ROLES_KEY = 'roles';
export const AccessRoles = (...roles: AccessRole[]) =>
  SetMetadata(METADATA_ROLES_KEY, roles);
