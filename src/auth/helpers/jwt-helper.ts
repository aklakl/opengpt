export interface JwtToken {
  header: { [key: string]: any };
  body: { [key: string]: any };
  signature?: string;
}

/**
 * Parse JWT token and return a parsed and unverified JSON object.
 *
 * @param {string} token Encoded JWT token.
 * @returns {JwtToken} Parsed/decoded JWT token as JSON object.
 */
export function parseJwtToken(token: string): JwtToken {
  const segments = token.split('.');
  if (segments.length < 2 || segments.length > 3) {
    throw new Error('JWT token either have 2 or 3 distinct segments');
  }

  const base64UrlUnescape = (str: string): string => {
    str += new Array(5 - (str.length % 4)).join('=');
    return str.replace(/-/g, '+').replace(/_/g, '/');
  };

  const header = JSON.parse(
    Buffer.from(base64UrlUnescape(segments[0]), 'base64').toString(),
  );
  const body = JSON.parse(
    Buffer.from(base64UrlUnescape(segments[1]), 'base64').toString(),
  );

  const decoded = {
    header,
    body,
  } as JwtToken;

  if (segments.length === 3) {
    decoded.signature = Buffer.from(
      base64UrlUnescape(segments[2]),
      'base64',
    ).toString('base64');
  }
  return decoded;
}
