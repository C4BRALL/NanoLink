import { CreateUserService } from 'src/core/use-cases/user/create-user.service';
import { CreateUserRepositoryInterface } from 'src/core/domain/repositories/user/create-user-repository.interface';
import { HashInterface } from 'src/core/domain/hash/hash.interface';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { InvalidUserDataError } from 'src/core/errors/user-error';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let repository: jest.Mocked<CreateUserRepositoryInterface>;
  let hash: jest.Mocked<HashInterface>;
  let jwt: jest.Mocked<JwtInterface>;
  const validParams = { name: 'John Doe', email: 'john@example.com', password: 'pass' };

  beforeEach(() => {
    repository = { save: jest.fn() } as any;
    hash = { hash: jest.fn() } as any;
    jwt = { sign: jest.fn(), verify: jest.fn() } as any;
    service = new CreateUserService(repository, hash, jwt);
  });

  it('should create user and return user data with token', async () => {
    hash.hash.mockResolvedValue('hashed-pass');
    repository.save.mockImplementation(async (u) => u as UserEntity);
    jwt.sign.mockReturnValue('jwt-token');

    const result = await service.execute(validParams);

    expect(hash.hash).toHaveBeenCalledWith('pass');
    expect(repository.save).toHaveBeenCalledWith(expect.any(UserEntity));

    const createdUser: UserEntity = repository.save.mock.calls[0][0];

    expect(jwt.sign).toHaveBeenCalledWith({ sub: createdUser.id });
    expect(result).toEqual({ user: createdUser.getUserData(), token: 'jwt-token' });
  });

  it('should throw InvalidUserDataError if hash throws', async () => {
    hash.hash.mockRejectedValue(new Error('hash error'));

    await expect(service.execute(validParams)).rejects.toThrow(InvalidUserDataError);
  });

  it('should throw InvalidUserDataError if repository.save throws', async () => {
    hash.hash.mockResolvedValue('hashed-pass');
    repository.save.mockRejectedValue(new Error('db error'));

    await expect(service.execute(validParams)).rejects.toThrow(InvalidUserDataError);
  });

  it('should throw InvalidUserDataError if jwt.sign throws', async () => {
    hash.hash.mockResolvedValue('hashed-pass');
    repository.save.mockImplementation(async (u) => u as UserEntity);
    jwt.sign.mockImplementation(() => {
      throw new Error('jwt error');
    });

    await expect(service.execute(validParams)).rejects.toThrow(InvalidUserDataError);
  });
});
