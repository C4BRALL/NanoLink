import { CreateUrlRepositoryInterface } from 'src/core/domain/repositories/create-url-repository.interface';
import { CreateUrlService } from 'src/core/use-cases/url/create-url.service';
import { CreateUrlRepositoryService } from 'src/infrastructure/database/repositories/url-repository/create-url-repository.service';
import { CreateUrlController } from 'src/interface/controllers/url/create-url.controller';
import { configureDbDriverMock } from '../../../../_mocks_/configure-db-driver-mock';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';

describe('CreateUrlController', () => {
  const expectedCreatedAt = Date.now();
  let _createUrlController: CreateUrlController;
  let _createUrlService: CreateUrlService;
  let _urlRepository: CreateUrlRepositoryInterface;
  let mockRepository: any;

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);

    const initialData = {
      originalUrl: 'https://www.google.com',
      shortCode: '123456',
      userId: 'fc32bc52-de79-4438-9cc8-3727d633cd1f',
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

    _urlRepository = new CreateUrlRepositoryService(mockRepository);
    _createUrlService = new CreateUrlService(_urlRepository, new EnvironmentConfigService(new ConfigService()));
    _createUrlController = new CreateUrlController(_createUrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new url with correct data and return 200', async () => {
    const result = await _createUrlController.createUrl({
      originalUrl: 'https://www.google.com',
      userId: 'fc32bc52-de79-4438-9cc8-3727d633cd1f',
    });

    expect(result).toEqual({
      url: {
        id: expect.any(String),
        originalUrl: 'https://www.google.com',
        shortCode: expect.any(String),
        userId: 'fc32bc52-de79-4438-9cc8-3727d633cd1f',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
        clickCount: 0,
        lastClickDate: undefined,
      },
      link: expect.any(String),
    });
  });

  it('should create a new url without userId and return 200', async () => {
    const result = await _createUrlController.createUrl({
      originalUrl: 'https://www.google.com',
    });

    expect(result).toEqual({
      url: {
        id: expect.any(String),
        originalUrl: 'https://www.google.com',
        shortCode: expect.any(String),
        userId: undefined,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: undefined,
        clickCount: 0,
        lastClickDate: undefined,
      },
      link: expect.any(String),
    });
  });

  it('should throw an error if the originalUrl is not a valid url', async () => {
    await expect(_createUrlController.createUrl({
      originalUrl: 'invalid-url',
    })).rejects.toThrow();
  });  
});
