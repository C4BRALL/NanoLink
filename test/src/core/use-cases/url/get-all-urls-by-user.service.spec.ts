import { GetAllUrlsByUserService } from 'src/core/use-cases/url/get-all-urls-by-user.service';
import { GetAllUrlsByUserRepositoryInterface } from 'src/core/domain/repositories/url/get-all-urls-by-user-repository.interface';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UrlRetrievalFailedError } from 'src/core/use-cases/errors/url-error';

describe('GetAllUrlsByUserService', () => {
  let service: GetAllUrlsByUserService;
  let repository: jest.Mocked<GetAllUrlsByUserRepositoryInterface>;
  const userId = '019698ea-ba2b-7332-aac4-3e6f4838d760';

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    };

    service = new GetAllUrlsByUserService(repository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all URLs for a specific user', async () => {
    const urls = [
      new UrlEntity({
        id: '019698ec-5074-7f93-a85f-c534d2a1c82d',
        shortCode: '123456',
        originalUrl: 'https://www.google.com',
        userId,
        clickCount: 5,
      }),
      new UrlEntity({
        id: '019698ec-7a78-7838-aaa0-641578e8413b',
        shortCode: 'abcdef',
        originalUrl: 'https://www.github.com',
        userId,
        clickCount: 10,
      }),
    ];

    repository.findAll.mockResolvedValue(urls);

    const result = await service.execute(userId);

    expect(repository.findAll).toHaveBeenCalledWith(userId);
    expect(result).toEqual(urls);
    expect(result).toHaveLength(2);
    expect(result[0].originalUrl).toBe('https://www.google.com');
    expect(result[1].originalUrl).toBe('https://www.github.com');
  });

  it('should return an empty array when user has no URLs', async () => {
    repository.findAll.mockResolvedValue([]);

    const result = await service.execute(userId);

    expect(repository.findAll).toHaveBeenCalledWith(userId);
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should wrap repository errors in UrlRetrievalFailedError', async () => {
    const repositoryError = new Error('Database connection error');
    repository.findAll.mockRejectedValue(repositoryError);

    await expect(service.execute(userId)).rejects.toThrow(UrlRetrievalFailedError);

    try {
      await service.execute(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(UrlRetrievalFailedError);
      expect(error.message).toContain(userId);
      expect(error.cause).toBe(repositoryError);
    }

    expect(repository.findAll).toHaveBeenCalledWith(userId);
  });
});
