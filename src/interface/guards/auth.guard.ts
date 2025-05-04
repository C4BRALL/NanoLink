import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthTokenInterface } from 'src/core/domain/auth/auth-token.interface';
import { UnauthorizedError } from 'src/core/errors/auth-error';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AuthTokenServiceInterface')
    private readonly authService: AuthTokenInterface,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    let token = null;
    if (request.cookies) {
      token = this.authService.extractTokenFromCookie(request.cookies);
    }

    if (!token && request.headers.authorization) {
      token = this.authService.extractTokenFromAuthHeader(request.headers.authorization);
    }

    if (!token) {
      throw new UnauthorizedError('Token is missing');
    }

    try {
      const { userId } = await this.authService.validateToken(token);
      (request as Request & { user: { userId: string } }).user = { userId };
      return true;
    } catch (error) {
      throw new UnauthorizedError('Invalid token');
    }
  }
}
