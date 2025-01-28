import { Request } from 'express';

export function extractJwtFromCookie(req: Request): string {
  // console.log(req);
  // console.log(req.cookies);
  return req.cookies.refreshToken;
}
