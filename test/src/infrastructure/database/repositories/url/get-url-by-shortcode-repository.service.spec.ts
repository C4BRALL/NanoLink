import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { configureDbDriverMock } from '../../../../../_mocks_/configure-db-driver-mock';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/url/get-url-by-shortcode-repository.interface';
import { GetUrlByShortCodeRepositoryService } from 'src/infrastructure/database/repositories/url/get-url-by-shortcode-repository.service';
import { DomainError } from 'src/core/errors/domain-error';

jest.mock('src/infrastructure/database/mappers/url.mapper', () => ({
  UrlMapper: {
    toPersistence: jest.fn((entity) => ({
      id: entity.id || 'd5d46e22-f1cc-4991-b461-b17a316ca545',
      shortCode: entity.shortCode,
      originalUrl: entity.originalUrl,
      clickCount: entity.clickCount,
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
          createdAt: model.createdAt,
          updatedAt: model.updatedAt,
        }),
    ),
  },
}));

import { UrlMapper } from 'src/infrastructure/database/mappers/url.mapper';

describe('GetUrlByShortCodeRepositoryService', () => {
  const expectedCreatedAt = Date.now();
  let getUrlByShortCodeRepository: GetUrlByShortCodeRepositoryInterface;
  let mockRepository: any;

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);
    jest.spyOn(console, 'error').mockImplementation(() => ({ log: jest.fn() }) as any);

    const initialData = {
      id: 'd5d46e22-f1cc-4991-b461-b17a316ca545',
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

    getUrlByShortCodeRepository = new GetUrlByShortCodeRepositoryService(mockRepository, new DatabaseErrorHandler());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a url by short code', async () => {
    const url = await getUrlByShortCodeRepository.findByShortCode('123456');

    expect(mockRepository.findOne).toHaveBeenCalled();
    expect(UrlMapper.toDomain).toHaveBeenCalled();
    expect(url).toBeInstanceOf(UrlEntity);
    expect(url?.id).toBe('d5d46e22-f1cc-4991-b461-b17a316ca545');
    expect(url?.shortCode).toBe('123456');
    expect(url?.originalUrl).toBe('https://www.google.com');
  });

  it('should throw an error when the url is not found', async () => {
    await expect(getUrlByShortCodeRepository.findByShortCode('invalid-short-code')).rejects.toBeInstanceOf(DomainError);
  });
});
