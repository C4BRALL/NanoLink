import { configureDbDriverMock } from '../../../../../_mocks_/configure-db-driver-mock';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { GetUserByEmailRepositoryInterface } from 'src/core/domain/repositories/user/get-user-by-email-repository.interface';
import { GetUserByEmailRepositoryService } from 'src/infrastructure/database/repositories/user/get-user-by-email-repository.service';
import { DatabaseError } from 'src/core/errors/database-error';

jest.mock('src/infrastructure/database/mappers/user.mapper', () => ({
  UserMapper: {
    toPersistence: jest.fn((entity) => ({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    })),
    toDomain: jest.fn(
      (model) =>
        new UserEntity({
          id: model.id,
          name: model.name,
          email: model.email,
          password: model.password,
          createdAt: model.createdAt,
          updatedAt: model.updatedAt,
          deletedAt: model.deletedAt,
        }),
    ),
  },
}));

import { UserMapper } from 'src/infrastructure/database/mappers/user.mapper';

describe('GetUserByEmailRepositoryService', () => {
  const expectedCreatedAt = Date.now();
  let getUserByEmailRepository: GetUserByEmailRepositoryInterface;
  let mockRepository: any;
  let errorHandler: DatabaseErrorHandler;

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);
    jest.spyOn(console, 'error').mockImplementation(() => ({ log: jest.fn() }) as any);

    const initialData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      createdAt: expectedCreatedAt,
      updatedAt: expectedCreatedAt,
    };

    const seedDB = [
      {
        data: [initialData],
      },
    ];

    const spies = await configureDbDriverMock(seedDB, 'user');
    mockRepository = spies.Repository;
    errorHandler = new DatabaseErrorHandler();

    getUserByEmailRepository = new GetUserByEmailRepositoryService(mockRepository, errorHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a user by email', async () => {
    const result = await getUserByEmailRepository.findByEmail('john.doe@example.com');

    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john.doe@example.com' } });
    expect(UserMapper.toDomain).toHaveBeenCalled();
    expect(result).toBeInstanceOf(UserEntity);
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john.doe@example.com');
  });

  it('should throw DatabaseError when user not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(getUserByEmailRepository.findByEmail('nonexistent@example.com')).rejects.toThrow(DatabaseError);
  });

  it('should delegate error handling to DatabaseErrorHandler', async () => {
    const repoError = new Error('database error');
    mockRepository.findOne.mockRejectedValue(repoError);

    const handleSpy = jest.spyOn(errorHandler, 'handleError').mockImplementation(() => {
      throw new Error('handled error');
    });

    await expect(getUserByEmailRepository.findByEmail('test@example.com')).rejects.toThrow('handled error');
    expect(handleSpy).toHaveBeenCalledWith(repoError, 'USER');
  });
});
