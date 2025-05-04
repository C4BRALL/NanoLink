import { configureDbDriverMock } from '../../../../../_mocks_/configure-db-driver-mock';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { CreateUserRepositoryInterface } from 'src/core/domain/repositories/user/create-user-repository.interface';
import { CreateUserRepositoryService } from 'src/infrastructure/database/repositories/user/create-user-repository.service';

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

describe('CreateUserRepositoryService', () => {
  const expectedCreatedAt = Date.now();
  let createUserRepository: CreateUserRepositoryInterface;
  let mockRepository: any;

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);

    const initialData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
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

    createUserRepository = new CreateUserRepositoryService(mockRepository, new DatabaseErrorHandler());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a user', async () => {
    const user = new UserEntity({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    });

    await createUserRepository.save(user);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(UserMapper.toPersistence).toHaveBeenCalledWith(user);
    expect(UserMapper.toDomain).toHaveBeenCalled();
  });

  it('should return a UserEntity with correct properties', async () => {
    const userInput = new UserEntity({ name: 'Jane Doe', email: 'jane.doe@example.com', password: 'password123' });
    const savedCreated = new Date(expectedCreatedAt);
    const savedUpdated = new Date(expectedCreatedAt);
    const savedModel = {
      id: userInput.id,
      name: userInput.name,
      email: userInput.email,
      password: userInput.password,
      createdAt: savedCreated,
      updatedAt: savedUpdated,
      deletedAt: undefined,
    };
    mockRepository.save.mockResolvedValue(savedModel as any);

    const result = await createUserRepository.save(userInput);

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.id).toBe(savedModel.id);
    expect(result.name).toBe(savedModel.name);
    expect(result.email).toBe(savedModel.email);
    expect(result.password).toBe(savedModel.password);
    expect(result.createdAt).toEqual(savedCreated);
    expect(result.updatedAt).toEqual(savedUpdated);
    expect(result.deletedAt).toBeUndefined();
  });

  describe('when repository.save throws an error', () => {
    it('should delegate error handling to DatabaseErrorHandler', async () => {
      const repoError = new Error('save failed');
      mockRepository.save.mockRejectedValue(repoError);
      const errorHandler = new DatabaseErrorHandler();
      const handleSpy = jest.spyOn(errorHandler, 'handleError').mockImplementation(() => {
        throw new Error('handled');
      });
      createUserRepository = new CreateUserRepositoryService(mockRepository, errorHandler);

      await expect(createUserRepository.save(new UserEntity({ name: 'John', email: 'x@x.com', password: 'xxxxxx' }))).rejects.toThrow(
        'handled',
      );
      expect(handleSpy).toHaveBeenCalledWith(repoError, 'USER');
    });
  });
});
