import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from 'src/interface/guards/auth.guard';
import { UnauthorizedError } from 'src/core/errors/auth-error';
import { AuthTokenInterface } from 'src/core/domain/auth/auth-token.interface';
import { Reflector } from '@nestjs/core';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jest.Mocked<AuthTokenInterface>;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    authService = {
      validateToken: jest.fn(),
      extractTokenFromCookie: jest.fn(),
      extractTokenFromAuthHeader: jest.fn(),
      tryGetUserIdFromRequest: jest.fn(),
    };

    reflector = {
      get: jest.fn(),
      getAllAndOverride: jest.fn(),
      getAllAndMerge: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: 'AuthTokenServiceInterface',
          useValue: authService,
        },
        {
          provide: Reflector,
          useValue: reflector,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true for valid token', async () => {
    reflector.get.mockReturnValue(false);

    const mockRequest = {
      cookies: { token: 'valid-jwt-token' },
      headers: { authorization: null },
      user: null,
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    authService.extractTokenFromCookie.mockReturnValue('valid-jwt-token');
    authService.validateToken.mockResolvedValue({ userId: 'test-user-id' });

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual({ userId: 'test-user-id' });
    expect(authService.extractTokenFromCookie).toHaveBeenCalledWith(mockRequest.cookies);
    expect(authService.validateToken).toHaveBeenCalledWith('valid-jwt-token');
  });

  it('should return true for public routes', async () => {
    reflector.get.mockReturnValue(true);

    const mockContext = {
      getHandler: () => ({}),
    } as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(authService.extractTokenFromCookie).not.toHaveBeenCalled();
    expect(authService.validateToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when no token is present', async () => {
    reflector.get.mockReturnValue(false);

    const mockRequest = {
      cookies: {},
      headers: { authorization: null },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    authService.extractTokenFromCookie.mockReturnValue(null);
    authService.extractTokenFromAuthHeader.mockReturnValue(null);

    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedError);
    expect(authService.extractTokenFromCookie).toHaveBeenCalledWith({});
    expect(authService.validateToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedError when token validation fails', async () => {
    reflector.get.mockReturnValue(false);

    const mockRequest = {
      cookies: { token: 'invalid-token' },
      headers: { authorization: null },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    authService.extractTokenFromCookie.mockReturnValue('invalid-token');
    authService.validateToken.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedError);
    expect(authService.extractTokenFromCookie).toHaveBeenCalledWith(mockRequest.cookies);
    expect(authService.validateToken).toHaveBeenCalledWith('invalid-token');
  });

  it('should try bearer token when cookie token is not present', async () => {
    reflector.get.mockReturnValue(false);

    const mockRequest = {
      cookies: {},
      headers: { authorization: 'Bearer valid-jwt-token' },
      user: null,
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    authService.extractTokenFromCookie.mockReturnValue(null);
    authService.extractTokenFromAuthHeader.mockReturnValue('valid-jwt-token');
    authService.validateToken.mockResolvedValue({ userId: 'test-user-id' });

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.user).toEqual({ userId: 'test-user-id' });
    expect(authService.extractTokenFromCookie).toHaveBeenCalledWith({});
    expect(authService.extractTokenFromAuthHeader).toHaveBeenCalledWith('Bearer valid-jwt-token');
    expect(authService.validateToken).toHaveBeenCalledWith('valid-jwt-token');
  });
});
