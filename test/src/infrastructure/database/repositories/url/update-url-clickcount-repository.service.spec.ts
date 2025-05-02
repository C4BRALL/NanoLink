import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';
import { configureDbDriverMock } from '../../../../../_mocks_/configure-db-driver-mock';
import { UpdateUrlClickCountRepositoryInterface } from 'src/core/domain/repositories/update-url-clickcount-repository.interface';
import { UpdateUrlClickCountRepositoryService } from 'src/infrastructure/database/repositories/url/update-url-clickcount-repository.service';
import { DomainError } from 'src/core/errors/domain-error';

describe('UpdateUrlRepositoryService', () => {
  const expectedCreatedAt = Date.now();
  let _updateUrlRepository: UpdateUrlClickCountRepositoryInterface;
  let mockRepository: any;
  const initialData = {
    id: 'd5d46e22-f1cc-4991-b461-b17a316ca545',
    originalUrl: 'https://www.google.com',
    shortCode: '123456',
    userId: 'fc32bc52-de79-4438-9cc8-3727d633cd1f',
    createdAt: expectedCreatedAt,
    updatedAt: expectedCreatedAt,
  };

  const deletedData = {
    id: '019691e7-e34b-7978-b35b-983062d70bd5',
    originalUrl: 'https://www.example.com/deleted',
    shortCode: 'delet1',
    userId: '01969201-1639-7a40-b36e-2540e5dc9a0e',
    clickCount: 1,
    lastClickDate: new Date(),
    createdAt: expectedCreatedAt,
    updatedAt: expectedCreatedAt,
    deletedAt: new Date(),
  };

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);
    jest.spyOn(console, 'error').mockImplementation(() => ({ log: jest.fn() }) as any)

    const seedDB = [
      {
        data: [initialData, deletedData],
      },
    ];

    const spies = await configureDbDriverMock(seedDB);
    mockRepository = spies.Repository;

    _updateUrlRepository = new UpdateUrlClickCountRepositoryService(mockRepository, new DatabaseErrorHandler());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a url', async () => {
    const url = new UrlEntity({
      id: initialData.id,
      originalUrl: initialData.originalUrl,
      shortCode: initialData.shortCode,
      userId: initialData.userId,
      clickCount: 1,
      lastClickDate: new Date(),
      createdAt: new Date(initialData.createdAt),
      updatedAt: new Date(initialData.updatedAt),
    });

    const updatedUrl = await _updateUrlRepository.update(url);

    expect(updatedUrl).toBeInstanceOf(UrlEntity);
    expect(updatedUrl.id).toBe(initialData.id);
    expect(updatedUrl.clickCount).toBe(1);
    expect(updatedUrl.lastClickDate).toBeDefined();
  });

  it('should throw an error when the url is not found', async () => {
    const url = new UrlEntity({
      id: deletedData.id,
      originalUrl: deletedData.originalUrl,
      shortCode: deletedData.shortCode,
      userId: deletedData.userId,
      clickCount: 2,
      lastClickDate: new Date(),
      createdAt: new Date(deletedData.createdAt),
      updatedAt: new Date(deletedData.updatedAt),
      deletedAt: new Date(deletedData.deletedAt),
    });

    await expect(
      _updateUrlRepository.update(url)
    )
      .rejects
      .toBeInstanceOf(DomainError);
  });
});
