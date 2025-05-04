import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { configureDbDriverMock } from '../../../../../_mocks_/configure-db-driver-mock';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';
import { GetAllUrlsByUserRepositoryInterface } from 'src/core/domain/repositories/url/get-all-urls-by-user-repository.interface';
import { GetAllUrlsByUserRepositoryService } from 'src/infrastructure/database/repositories/url/get-all-urls-by-user-repository.service';

jest.mock('src/infrastructure/database/mappers/url.mapper', () => ({
  UrlMapper: {
    toPersistence: jest.fn((entity) => ({
      id: entity.id || 'd5d46e22-f1cc-4991-b461-b17a316ca545',
      shortCode: entity.shortCode,
      originalUrl: entity.originalUrl,
      clickCount: entity.clickCount,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })),
    toDomain: jest.fn(
      (model) =>
        new UrlEntity({
          id: model.id,
          shortCode: model.shortCode,
          originalUrl: model.originalUrl,
          clickCount: model.clickCount,
          userId: model.userId,
          createdAt: model.createdAt,
          updatedAt: model.updatedAt,
        }),
    ),
  },
}));

import { UrlMapper } from 'src/infrastructure/database/mappers/url.mapper';

describe('GetAllUrlsByUserRepositoryService', () => {
  const expectedCreatedAt = Date.now();
  let getAllUrlsByUserRepository: GetAllUrlsByUserRepositoryInterface;
  let mockRepository: any;
  let errorHandler: DatabaseErrorHandler;
  const testUserId = '019698ea-ba2b-7332-aac4-3e6f4838d760';

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);
    jest.spyOn(console, 'error').mockImplementation(() => ({ log: jest.fn() }) as any);

    const urlData1 = {
      id: '019698ec-5074-7f93-a85f-c534d2a1c82d',
      originalUrl: 'https://www.google.com',
      shortCode: '123456',
      userId: testUserId,
      clickCount: 5,
      createdAt: expectedCreatedAt,
      updatedAt: expectedCreatedAt,
    };

    const urlData2 = {
      id: '019698ec-7a78-7838-aaa0-641578e8413b',
      originalUrl: 'https://www.github.com',
      shortCode: 'abcdef',
      userId: testUserId,
      clickCount: 10,
      createdAt: expectedCreatedAt,
      updatedAt: expectedCreatedAt,
    };

    const urlData3 = {
      id: '019698ec-92e9-7e1e-b813-72c5fc051784',
      originalUrl: 'https://www.example.com',
      shortCode: 'xyz123',
      userId: '019698e9-c47e-76b3-8f1e-e84944afd01e',
      clickCount: 3,
      createdAt: expectedCreatedAt,
      updatedAt: expectedCreatedAt,
    };

    const seedDB = [
      {
        data: [urlData1, urlData2, urlData3],
      },
    ];

    const spies = await configureDbDriverMock(seedDB, 'url');
    mockRepository = spies.Repository;
    errorHandler = new DatabaseErrorHandler();

    getAllUrlsByUserRepository = new GetAllUrlsByUserRepositoryService(mockRepository, errorHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all URLs for a specific user', async () => {
    const urls = await getAllUrlsByUserRepository.findAll(testUserId);

    expect(mockRepository.find).toHaveBeenCalledWith({ where: { userId: testUserId } });
    expect(UrlMapper.toDomain).toHaveBeenCalledTimes(2);
    expect(urls).toHaveLength(2);
    expect(urls[0]).toBeInstanceOf(UrlEntity);
    expect(urls[1]).toBeInstanceOf(UrlEntity);

    expect(urls.map((url) => url.shortCode).sort()).toEqual(['123456', 'abcdef'].sort());
    expect(urls.map((url) => url.originalUrl).sort()).toEqual(['https://www.google.com', 'https://www.github.com'].sort());
    expect(urls.every((url) => url.userId === testUserId)).toBe(true);
  });

  it('should return an empty array when user has no URLs', async () => {
    mockRepository.find.mockResolvedValue([]);

    const urls = await getAllUrlsByUserRepository.findAll('user-with-no-urls');

    expect(mockRepository.find).toHaveBeenCalledWith({ where: { userId: 'user-with-no-urls' } });
    expect(urls).toHaveLength(0);
    expect(urls).toEqual([]);
  });

  it('should handle database errors properly', async () => {
    const dbError = new Error('Database connection error');
    mockRepository.find.mockRejectedValue(dbError);

    const handleErrorSpy = jest.spyOn(errorHandler, 'handleError').mockImplementation(() => {
      throw new Error('Handled database error');
    });

    await expect(getAllUrlsByUserRepository.findAll(testUserId)).rejects.toThrow('Handled database error');

    expect(handleErrorSpy).toHaveBeenCalledWith(dbError, 'URL');
  });
});
