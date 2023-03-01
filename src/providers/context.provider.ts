import { getValue, setValue } from 'express-ctx';

import type { OktaClaims } from '../auth/interfaces/claims.dto';

export class ContextProvider {
  private static readonly nameSpace = 'request';

  private static readonly authUserKey = 'user_key';

  private static get<T>(key: string): T | undefined {
    return getValue<T>(ContextProvider.getKeyWithNamespace(key));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static set(key: string, value: any): void {
    setValue(ContextProvider.getKeyWithNamespace(key), value);
  }

  private static getKeyWithNamespace(key: string): string {
    return `${ContextProvider.nameSpace}.${key}`;
  }

  static setAuthUser(user: OktaClaims): void {
    ContextProvider.set(ContextProvider.authUserKey, user);
  }

  static getAuthUser(): OktaClaims {
    const user = ContextProvider.get<OktaClaims>(ContextProvider.authUserKey);
    return user || ({} as OktaClaims);
  }

  static getAuthUserName(): string {
    const user = ContextProvider.get<OktaClaims>(ContextProvider.authUserKey);
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else {
      return user?.firstName || user?.lastName || '';
    }
  }
}
