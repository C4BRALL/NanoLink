import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/url/get-url-by-shortcode-repository.interface';
import { GetUrlByShortCodeInterface } from 'src/core/domain/use-cases/url/get-url-by-shortcode.interface';
import { GetUrlByShortCodeService } from 'src/core/use-cases/url/get-url-by-shortcode.service';
import { GetUrlByShortCodeRepositoryService } from 'src/infrastructure/database/repositories/url/get-url-by-shortcode-repository.service';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';
import { configureDbDriverMock } from '../../../../_mocks_/configure-db-driver-mock';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UpdateUrlClickCountRepositoryInterface } from 'src/core/domain/repositories/url/update-url-clickcount-repository.interface';
import { UpdateUrlClickCountRepositoryService } from 'src/infrastructure/database/repositories/url/update-url-clickcount-repository.service';
import { UrlRetrievalFailedError } from 'src/core/use-cases/errors/url-error';

describe('GetUrlByShortCodeService', () => {
  let _getUrlByShortCodeService: GetUrlByShortCodeInterface;
  let _urlRepository: GetUrlByShortCodeRepositoryInterface;
  let _updateUrlRepository: UpdateUrlClickCountRepositoryInterface;
  const expectedCreatedAt = Date.now();
  let mockRepository: any;
  const initialData = {
    originalUrl: 'https://www.google.com',
    shortCode: 'short1',
    userId: 'cc435f3c-6c26-40ef-abe8-635a475c8a7c',
    createdAt: expectedCreatedAt,
    updatedAt: expectedCreatedAt,
  };

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => ({ log: jest.fn() }) as any);

    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);

    const seedDB = [
      {
        data: [initialData],
      },
    ];

    const spies = await configureDbDriverMock(seedDB, 'url');
    mockRepository = spies.Repository;

    _urlRepository = new GetUrlByShortCodeRepositoryService(mockRepository, new DatabaseErrorHandler());
    _updateUrlRepository = new UpdateUrlClickCountRepositoryService(mockRepository, new DatabaseErrorHandler());
    _getUrlByShortCodeService = new GetUrlByShortCodeService(_urlRepository, _updateUrlRepository);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should return the url when the short code is found', async () => {
    const result = await _getUrlByShortCodeService.execute({ shortCode: 'short1' });

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(UrlEntity);
    expect(result.id).toBeDefined();
    expect(result.originalUrl).toBe(initialData.originalUrl);
    expect(result.shortCode).toBe(initialData.shortCode);
    expect(result.userId).toBe(initialData.userId);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.clickCount).toBe(1);
    expect(result.isDeleted()).toBeFalsy();
    expect(result.deletedAt).toBeUndefined();
  });

  it('should return a error when the short code is not found', async () => {
    await expect(_getUrlByShortCodeService.execute({ shortCode: 'inv123' })).rejects.toBeInstanceOf(UrlRetrievalFailedError);
  });
});
