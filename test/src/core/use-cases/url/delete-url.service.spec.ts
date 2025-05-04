import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUrlService } from 'src/core/use-cases/url/delete-url.service';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { DeleteUrlRepositoryInterface } from 'src/core/domain/repositories/url/delete-url-repository.interface';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/url/get-url-by-shortcode-repository.interface';
import { UrlDeletionFailedError } from 'src/core/use-cases/errors/url-error';

describe('DeleteUrlService', () => {
  let service: DeleteUrlService;
  let getUrlByShortCodeRepository: jest.Mocked<GetUrlByShortCodeRepositoryInterface>;
  let deleteUrlRepository: jest.Mocked<DeleteUrlRepositoryInterface>;

  const mockShortCode = 'abc123';
  const mockUserId = '019698ea-ba2b-7332-aac4-3e6f4838d760';
  const mockUrlId = '019698ec-5074-7f93-a85f-c534d2a1c82d';

  beforeEach(async () => {
    const getUrlByShortCodeRepositoryMock = {
      findByShortCode: jest.fn(),
    };

    const deleteUrlRepositoryMock = {
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUrlService,
        {
          provide: 'GetUrlByShortCodeRepositoryInterface',
          useValue: getUrlByShortCodeRepositoryMock,
        },
        {
          provide: 'DeleteUrlRepositoryInterface',
          useValue: deleteUrlRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<DeleteUrlService>(DeleteUrlService);
    getUrlByShortCodeRepository = module.get('GetUrlByShortCodeRepositoryInterface') as jest.Mocked<GetUrlByShortCodeRepositoryInterface>;
    deleteUrlRepository = module.get('DeleteUrlRepositoryInterface') as jest.Mocked<DeleteUrlRepositoryInterface>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a URL successfully', async () => {
    const now = new Date();
    const urlEntity = new UrlEntity({
      id: mockUrlId,
      shortCode: mockShortCode,
      originalUrl: 'https://www.example.com',
      userId: mockUserId,
      createdAt: now,
      updatedAt: now,
    });

    const softDeleteSpy = jest.spyOn(urlEntity, 'softDelete');

    getUrlByShortCodeRepository.findByShortCode.mockResolvedValue(urlEntity);
    deleteUrlRepository.delete.mockResolvedValue(urlEntity);

    const result = await service.execute({ shortCode: mockShortCode });

    expect(getUrlByShortCodeRepository.findByShortCode).toHaveBeenCalledWith(mockShortCode);
    expect(softDeleteSpy).toHaveBeenCalled();
    expect(deleteUrlRepository.delete).toHaveBeenCalledWith(urlEntity);
    expect(result).toEqual(urlEntity);
    expect(result.isDeleted()).toBe(true);
  });

  it('should throw UrlDeletionFailedError when URL is not found', async () => {
    const error = new Error('URL not found');
    getUrlByShortCodeRepository.findByShortCode.mockRejectedValue(error);

    await expect(service.execute({ shortCode: mockShortCode })).rejects.toThrow(UrlDeletionFailedError);

    expect(getUrlByShortCodeRepository.findByShortCode).toHaveBeenCalledWith(mockShortCode);
    expect(deleteUrlRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw UrlDeletionFailedError when deletion fails', async () => {
    const now = new Date();
    const urlEntity = new UrlEntity({
      id: mockUrlId,
      shortCode: mockShortCode,
      originalUrl: 'https://www.example.com',
      userId: mockUserId,
      createdAt: now,
      updatedAt: now,
    });

    const error = new Error('Delete operation failed');
    getUrlByShortCodeRepository.findByShortCode.mockResolvedValue(urlEntity);
    deleteUrlRepository.delete.mockRejectedValue(error);

    await expect(service.execute({ shortCode: mockShortCode })).rejects.toThrow(UrlDeletionFailedError);

    expect(getUrlByShortCodeRepository.findByShortCode).toHaveBeenCalledWith(mockShortCode);
    expect(deleteUrlRepository.delete).toHaveBeenCalledWith(urlEntity);
  });
});
