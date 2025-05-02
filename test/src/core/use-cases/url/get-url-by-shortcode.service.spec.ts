import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/get-url-by-shortcode-repository.interface';
import { GetUrlByShortCodeInterface } from 'src/core/domain/use-cases/get-url-by-shortcode.interface';
import { GetUrlByShortCodeService } from 'src/core/use-cases/url/get-url-by-shortcode.service';
import { GetUrlByShortCodeRepositoryService } from 'src/infrastructure/database/repositories/url/get-url-by-shortcode-repository.service';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';
import { configureDbDriverMock } from '../../../../_mocks_/configure-db-driver-mock';
import { UrlRetrievalFailedError } from 'src/core/use-cases/errors/url-error';

describe('GetUrlByShortCodeService', () => {
  let _getUrlByShortCodeService: GetUrlByShortCodeInterface;
  let _urlRepository: GetUrlByShortCodeRepositoryInterface;
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
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);

    const seedDB = [
      {
        data: [initialData],
      },
    ];

    const spies = await configureDbDriverMock(seedDB);
    mockRepository = spies.Repository;

    _urlRepository = new GetUrlByShortCodeRepositoryService(mockRepository, new DatabaseErrorHandler());
    _getUrlByShortCodeService = new GetUrlByShortCodeService(_urlRepository);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should return the url when the short code is found', async () => {
    const result = await _getUrlByShortCodeService.execute({ shortCode: 'short1' });

    expect(result.url.id).toBeDefined();
    expect(result.url.originalUrl).toBe(initialData.originalUrl);
    expect(result.url.shortCode).toBe(initialData.shortCode);
    expect(result.url.userId).toBe(initialData.userId);
    expect(result.url.createdAt).toBeInstanceOf(Date);
    expect(result.url.updatedAt).toBeInstanceOf(Date);
    expect(result.url.clickCount).toBe(0);
    expect(result.url.isDeleted()).toBeFalsy();
    expect(result.url.deletedAt).toBeUndefined();
  });

  it('should throw an error when the short code is not found', async () => {
    await expect(_getUrlByShortCodeService.execute({ shortCode: 'non-existent-short-code' })).rejects.toThrow(UrlRetrievalFailedError);
  });
});
