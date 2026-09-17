export interface TokenPayload {
  sub: number;
  email: string;
  role: 'JOB_SEEKER' | 'COMPANY';
  iat: number;
  exp: number;
}

export function decodeToken(token: string): TokenPayload {
  const payload = token.split('.')[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
}