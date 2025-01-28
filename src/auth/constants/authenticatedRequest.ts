import { Request } from 'express';
import { JWTPayload } from './jwtPayload';

export class AuthenticatedRequest extends Request {
  user: JWTPayload;
  cookies: { refreshToken: string };
}
