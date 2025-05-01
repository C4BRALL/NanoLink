import { CreateUrlRepositoryInterface } from 'src/core/domain/repositories/create-url-repository.interface';
import { CreateUrlInterface } from 'src/core/domain/use-cases/create-url.interface';
import { CreateUrlService } from 'src/core/use-cases/url/create-url.service';
import { CreateUrlRepositoryService } from 'src/infrastructure/database/repositories/url-repository/create-url-repository.service';
import { configureDbDriverMock } from '../../../../_mocks_/configure-db-driver-mock';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';

describe('CreateUrlService', () => {
  let _createUrlService: CreateUrlInterface;
  let _urlRepository: CreateUrlRepositoryInterface;
  const expectedCreatedAt = Date.now();
  let mockRepository: any;

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);

    const initialData = {
      originalUrl: 'https://www.google.com',
      shortCode: '123456',
      userId: '123456',
      createdAt: expectedCreatedAt,
      updatedAt: expectedCreatedAt,
    };

    const seedDB = [
      {
        data: [initialData],
      },
    ];

    const spies = await configureDbDriverMock(seedDB);
    mockRepository = spies.Repository;
    _urlRepository = new CreateUrlRepositoryService(mockRepository, new DatabaseErrorHandler());
    _createUrlService = new CreateUrlService(_urlRepository, new EnvironmentConfigService(new ConfigService()));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new url with all properties', async () => {
    const validParams = {
      originalUrl: 'https://www.google.com',
      userId: 'bebb3484-1cc0-409b-a7a4-a00f1a71ab85',
    };

    jest.spyOn(_urlRepository, 'save').mockReturnThis();

    const result = await _createUrlService.execute(validParams);

    expect(_urlRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result.url.id).toBeDefined();
    expect(result.url.originalUrl).toBe('https://www.google.com');
    expect(result.url.shortCode).toBeDefined();
    expect(result.url.userId).toBe('bebb3484-1cc0-409b-a7a4-a00f1a71ab85');
    expect(result.url.createdAt).toBeDefined();
    expect(result.url.updatedAt).toBeDefined();
    expect(result.url.deletedAt).toBeUndefined();
    expect(result.url.isDeleted()).toBe(false);
    expect(result.url.clickCount).toBe(0);
    expect(result.url.lastClickDate).toBeUndefined();
    expect(result.link).toBeDefined();
  });

  it('should create a new url without userId property', async () => {
    const validParams = {
      originalUrl: 'https://www.google.com',
    };

    jest.spyOn(_urlRepository, 'save').mockReturnThis();

    const result = await _createUrlService.execute(validParams);

    expect(_urlRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result.url.id).toBeDefined();
    expect(result.url.originalUrl).toBe('https://www.google.com');
    expect(result.url.shortCode).toBeDefined();
    expect(result.url.userId).toBeUndefined();
    expect(result.url.createdAt).toBeDefined();
    expect(result.url.updatedAt).toBeDefined();
    expect(result.url.deletedAt).toBeUndefined();
    expect(result.url.isDeleted()).toBe(false);
    expect(result.url.clickCount).toBe(0);
    expect(result.url.lastClickDate).toBeUndefined();
    expect(result.link).toBeDefined();
  });

  it('should throw an error if the originalUrl is not a valid url', async () => {
    const invalidParams = {
      originalUrl: 'invalid-url',
    };

    await expect(_createUrlService.execute(invalidParams)).rejects.toThrow();
  });

  it('should throw an error if the userId is not a valid uuid', async () => {
    const invalidParams = {
      originalUrl: 'https://www.google.com',
      userId: 'invalid_user_id',
    };

    await expect(_createUrlService.execute(invalidParams)).rejects.toThrow();
  });
});
