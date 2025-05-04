import { Inject, Injectable } from '@nestjs/common';
import { AuthTokenInterface } from 'src/core/domain/auth/auth-token.interface';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';
import { TokenInvalidError, TokenMissingError } from 'src/core/errors/auth-error';

@Injectable()
export class AuthTokenService implements AuthTokenInterface {
  constructor(
    @Inject('JwtInterface')
    private readonly jwt: JwtInterface,
  ) {}

  async validateToken(token: string): Promise<{ userId: string }> {
    try {
      if (!token) {
        throw new TokenMissingError();
      }

      const payload = this.jwt.verify<{ sub: string }>(token);
      return { userId: payload.sub };
    } catch (error) {
      if (error instanceof TokenMissingError) {
        throw error;
      }
      throw new TokenInvalidError();
    }
  }

  extractTokenFromCookie(cookies: Record<string, string>): string | null {
    return cookies && cookies['token'] ? cookies['token'] : null;
  }

  extractTokenFromAuthHeader(authHeader: string): string | null {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  async tryGetUserIdFromRequest(request: any): Promise<string | null> {
    try {
      let token = this.extractTokenFromCookie(request.cookies);

      if (!token && request.headers && request.headers.authorization) {
        token = this.extractTokenFromAuthHeader(request.headers.authorization);
      }

      if (!token) {
        return null;
      }

      try {
        const { userId } = await this.validateToken(token);
        return userId;
      } catch (error) {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}
