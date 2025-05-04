import { Test, TestingModule } from '@nestjs/testing';
import { AuthTokenService } from 'src/infrastructure/auth/auth-token.service';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';
import { TokenInvalidError, TokenMissingError } from 'src/core/errors/auth-error';

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let jwtMock: jest.Mocked<JwtInterface>;

  beforeEach(async () => {
    jwtMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthTokenService,
        {
          provide: 'JwtInterface',
          useValue: jwtMock,
        },
      ],
    }).compile();

    service = module.get<AuthTokenService>(AuthTokenService);
  });

  describe('validateToken', () => {
    it('should validate a token and return userId', async () => {
      const token = 'valid.token.here';
      jwtMock.verify.mockReturnValue({ sub: 'user-123' });

      const result = await service.validateToken(token);

      expect(result).toEqual({ userId: 'user-123' });
      expect(jwtMock.verify).toHaveBeenCalledWith(token);
    });

    it('should throw TokenMissingError for empty token', async () => {
      await expect(service.validateToken('')).rejects.toThrow(TokenMissingError);
      expect(jwtMock.verify).not.toHaveBeenCalled();
    });

    it('should throw TokenInvalidError when JWT verification fails', async () => {
      const token = 'invalid.token.here';
      jwtMock.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.validateToken(token)).rejects.toThrow(TokenInvalidError);
      expect(jwtMock.verify).toHaveBeenCalledWith(token);
    });
  });

  describe('extractTokenFromCookie', () => {
    it('should extract token from cookies', () => {
      const cookies = { token: 'some-token', other: 'value' };

      const result = service.extractTokenFromCookie(cookies);

      expect(result).toBe('some-token');
    });

    it('should return null when no token cookie exists', () => {
      const cookies = { other: 'value' };

      const result = service.extractTokenFromCookie(cookies);

      expect(result).toBeNull();
    });

    it('should handle empty cookies object', () => {
      const result = service.extractTokenFromCookie({});

      expect(result).toBeNull();
    });
  });
});
