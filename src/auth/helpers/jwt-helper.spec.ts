import { expect } from 'chai';
import { parseJwtToken } from './jwt-helper';

describe('jwt-helper', () => {
  it('should decode a JWT token with 3 segments', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const decoded = parseJwtToken(token);
    expect(decoded).to.deep.eq({
      header: {
        alg: 'HS256',
        typ: 'JWT',
      },
      body: {
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      },
      signature: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV/adQssw5c=',
    });
  });

  it('should decode a JWT token with 2 segments', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
    const decoded = parseJwtToken(token);
    expect(decoded).to.deep.eq({
      header: {
        alg: 'HS256',
        typ: 'JWT',
      },
      body: {
        sub: '1234567890',
        name: 'John Doe',
        iat: 1516239022,
      },
    });
  });

  it('should throw an error if token is not valid', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const fn = () => parseJwtToken(token);
    expect(fn).to.throw('JWT token either have 2 or 3 distinct segments');
  });
});
