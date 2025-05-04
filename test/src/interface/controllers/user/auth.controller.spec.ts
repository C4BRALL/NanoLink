import { AuthController } from 'src/interface/controllers/user/auth.controller';
import { AuthUserService } from 'src/core/use-cases/user/auth-user.service';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { LoginDto } from 'src/interface/dtos/user/login-dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthUserService>;
  let response: jest.Mocked<Response>;

  beforeEach(() => {
    authService = {
      execute: jest.fn(),
    } as any;

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    } as any;

    controller = new AuthController(authService);
  });

  it('should authenticate user and return 200 with user data when credentials are valid', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const userData = {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: 'jwt-token-123',
    };

    authService.execute.mockResolvedValue(userData);

    await controller.login(loginDto, response);

    expect(authService.execute).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.cookie).toHaveBeenCalledWith('token', 'jwt-token-123', {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
      sameSite: 'strict',
    });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(userData);
  });

  it('should throw InvalidUserDataError when validation fails', async () => {
    const invalidLoginDto = {
      email: 'invalid-email',
      password: '123',
    } as LoginDto;

    await expect(controller.login(invalidLoginDto, response)).rejects.toThrow(InvalidUserDataError);

    expect(authService.execute).not.toHaveBeenCalled();
    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(response.cookie).not.toHaveBeenCalled();
  });

  it('should propagate errors from the auth service', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const authError = new InvalidUserDataError('test@example.com');
    authService.execute.mockRejectedValue(authError);

    await expect(controller.login(loginDto, response)).rejects.toThrow(InvalidUserDataError);

    expect(authService.execute).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
    expect(response.cookie).not.toHaveBeenCalled();
  });
});
