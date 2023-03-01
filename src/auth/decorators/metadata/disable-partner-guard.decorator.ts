import { SetMetadata } from '@nestjs/common';

export const METADATA_DISABLE_PARTNER_GUARD_KEY = 'disable_partner_guard';
export const DisablePartnerGuard = () =>
  SetMetadata(METADATA_DISABLE_PARTNER_GUARD_KEY, true);
