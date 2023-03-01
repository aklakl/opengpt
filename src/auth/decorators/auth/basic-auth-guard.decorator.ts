import { AuthGuard } from '@nestjs/passport';

export const defaultStrategy = 'basic';
export const BasicGuard = AuthGuard([defaultStrategy]);
