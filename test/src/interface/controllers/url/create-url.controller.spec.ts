import { CreateUrlRepositoryInterface } from 'src/core/domain/repositories/url/create-url-repository.interface';
import { CreateUrlService } from 'src/core/use-cases/url/create-url.service';
import { CreateUrlRepositoryService } from 'src/infrastructure/database/repositories/url/create-url-repository.service';
import { CreateUrlController } from 'src/interface/controllers/url/create-url.controller';
import { configureDbDriverMock } from '../../../../_mocks_/configure-db-driver-mock';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';

describe('CreateUrlController', () => {
  const expectedCreatedAt = Date.now();
  let _createUrlController: CreateUrlController;
  let _createUrlService: CreateUrlService;
  let _urlRepository: CreateUrlRepositoryInterface;
  let mockRepository: any;
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    redirect: jest.fn(),
  };

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

    const spies = await configureDbDriverMock(seedDB, 'url');

    mockRepository = spies.Repository;

    _urlRepository = new CreateUrlRepositoryService(mockRepository, new DatabaseErrorHandler());
    _createUrlService = new CreateUrlService(_urlRepository, new EnvironmentConfigService(new ConfigService()));
    _createUrlController = new CreateUrlController(_createUrlService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new url with correct data and return 201', async () => {
    await _createUrlController.createUrl(
      {
        originalUrl: 'https://www.google.com',
        userId: 'fc32bc52-de79-4438-9cc8-3727d633cd1f',
      },
      mockResponse as any,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.objectContaining({
          originalUrl: 'https://www.google.com',
          userId: 'fc32bc52-de79-4438-9cc8-3727d633cd1f',
        }),
        link: expect.any(String),
      }),
    );
  });

  it('should create a new url without userId and return 201', async () => {
    await _createUrlController.createUrl(
      {
        originalUrl: 'https://www.google.com',
      },
      mockResponse as any,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.objectContaining({
          originalUrl: 'https://www.google.com',
          userId: undefined,
        }),
        link: expect.any(String),
      }),
    );
  });

  it('should throw an error if the originalUrl is not a valid url', async () => {
    await expect(
      _createUrlController.createUrl(
        {
          originalUrl: 'invalid-url',
        },
        mockResponse as any,
      ),
    ).rejects.toThrow();
  });
});
