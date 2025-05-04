import { AuthUserService } from 'src/core/use-cases/user/auth-user.service';
import { GetUserByEmailRepositoryInterface } from 'src/core/domain/repositories/user/get-user-by-email-repository.interface';
import { HashInterface } from 'src/core/domain/hash/hash.interface';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { DatabaseError } from 'src/core/errors/database-error';

describe('AuthUserService', () => {
  let service: AuthUserService;
  let userRepo: jest.Mocked<GetUserByEmailRepositoryInterface>;
  let hash: jest.Mocked<HashInterface>;
  let jwt: jest.Mocked<JwtInterface>;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
    } as any;

    hash = {
      hash: jest.fn(),
      compare: jest.fn(),
    } as any;

    jwt = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    service = new AuthUserService(userRepo, hash, jwt);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should authenticate user and return user data with token when credentials are valid', async () => {
    const mockUser = new UserEntity({
      id: '01969895-77af-7a09-ad7a-3e71131080aa',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password',
    });

    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    jest.spyOn(mockUser, 'getUserData').mockReturnValue(userData);

    userRepo.findByEmail.mockResolvedValue(mockUser);
    hash.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('jwt-token-123');

    const result = await service.execute({ email: 'test@example.com', password: 'correct-password' });

    expect(userRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(hash.compare).toHaveBeenCalledWith('correct-password', 'hashed-password');
    expect(jwt.sign).toHaveBeenCalledWith({ sub: '01969895-77af-7a09-ad7a-3e71131080aa' });
    expect(result).toEqual({
      user: userData,
      token: 'jwt-token-123',
    });
  });

  it('should throw UnauthorizedUserDataError when password is incorrect', async () => {
    const mockUser = new UserEntity({
      id: '01969895-77af-7a09-ad7a-3e71131080aa',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed-password',
    });

    userRepo.findByEmail.mockResolvedValue(mockUser);
    hash.compare.mockResolvedValue(false);

    await expect(service.execute({ email: 'test@example.com', password: 'wrong-password' })).rejects.toThrow(InvalidUserDataError);

    expect(userRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(hash.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password');
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it('should propagate error when user is not found', async () => {
    const dbError = new DatabaseError('User not found');
    userRepo.findByEmail.mockRejectedValue(dbError);

    await expect(service.execute({ email: 'nonexistent@example.com', password: 'any-password' })).rejects.toThrow(dbError);

    expect(userRepo.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(hash.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
