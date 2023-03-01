export interface IAuthProvider {
  verifyToken(token: string): Promise<any>;
}
