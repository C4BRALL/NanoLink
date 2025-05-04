import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUrlOriginalUrlService } from 'src/core/use-cases/url/update-url-originalurl.service';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/url/get-url-by-shortcode-repository.interface';
import { UpdateUrlOriginalUrlRepositoryInterface } from 'src/core/domain/repositories/url/update-url-originalurl-repository.interface';
import { UrlUpdateFailedError } from 'src/core/use-cases/errors/url-error';

describe('UpdateUrlOriginalUrlService', () => {
  let service: UpdateUrlOriginalUrlService;
  let getUrlByShortCodeRepository: jest.Mocked<GetUrlByShortCodeRepositoryInterface>;
  let updateUrlOriginalUrlRepository: jest.Mocked<UpdateUrlOriginalUrlRepositoryInterface>;

  const mockShortCode = 'abc123';
  const mockUserId = '019698ea-ba2b-7332-aac4-3e6f4838d760';
  const mockUrlId = '019698ec-5074-7f93-a85f-c534d2a1c82d';
  const originalUrl = 'https://www.example.com';
  const newOriginalUrl = 'https://www.updated-example.com';

  beforeEach(async () => {
    const getUrlByShortCodeRepositoryMock = {
      findByShortCode: jest.fn(),
    };

    const updateUrlOriginalUrlRepositoryMock = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUrlOriginalUrlService,
        {
          provide: 'GetUrlByShortCodeRepositoryInterface',
          useValue: getUrlByShortCodeRepositoryMock,
        },
        {
          provide: 'UpdateUrlOriginalUrlRepositoryInterface',
          useValue: updateUrlOriginalUrlRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UpdateUrlOriginalUrlService>(UpdateUrlOriginalUrlService);
    getUrlByShortCodeRepository = module.get('GetUrlByShortCodeRepositoryInterface') as jest.Mocked<GetUrlByShortCodeRepositoryInterface>;
    updateUrlOriginalUrlRepository = module.get(
      'UpdateUrlOriginalUrlRepositoryInterface',
    ) as jest.Mocked<UpdateUrlOriginalUrlRepositoryInterface>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update URL originalUrl successfully', async () => {
    const now = new Date();
    const urlEntity = new UrlEntity({
      id: mockUrlId,
      shortCode: mockShortCode,
      originalUrl: originalUrl,
      userId: mockUserId,
      createdAt: now,
      updatedAt: now,
    });

    const updateSpy = jest.spyOn(urlEntity, 'update');

    getUrlByShortCodeRepository.findByShortCode.mockResolvedValue(urlEntity);
    updateUrlOriginalUrlRepository.update.mockResolvedValue(urlEntity);

    const result = await service.execute({
      shortCode: mockShortCode,
      originalUrl: newOriginalUrl,
    });

    expect(getUrlByShortCodeRepository.findByShortCode).toHaveBeenCalledWith(mockShortCode);
    expect(updateSpy).toHaveBeenCalledWith(newOriginalUrl);
    expect(updateUrlOriginalUrlRepository.update).toHaveBeenCalledWith(urlEntity);
    expect(result).toEqual(urlEntity);
    expect(result.originalUrl).toBe(newOriginalUrl);
  });

  it('should throw UrlUpdateFailedError when URL is not found', async () => {
    const error = new Error('URL not found');
    getUrlByShortCodeRepository.findByShortCode.mockRejectedValue(error);

    await expect(
      service.execute({
        shortCode: mockShortCode,
        originalUrl: newOriginalUrl,
      }),
    ).rejects.toThrow(UrlUpdateFailedError);

    expect(getUrlByShortCodeRepository.findByShortCode).toHaveBeenCalledWith(mockShortCode);
    expect(updateUrlOriginalUrlRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UrlUpdateFailedError when update fails', async () => {
    const now = new Date();
    const urlEntity = new UrlEntity({
      id: mockUrlId,
      shortCode: mockShortCode,
      originalUrl: originalUrl,
      userId: mockUserId,
      createdAt: now,
      updatedAt: now,
    });

    const error = new Error('Update operation failed');
    getUrlByShortCodeRepository.findByShortCode.mockResolvedValue(urlEntity);
    updateUrlOriginalUrlRepository.update.mockRejectedValue(error);

    await expect(
      service.execute({
        shortCode: mockShortCode,
        originalUrl: newOriginalUrl,
      }),
    ).rejects.toThrow(UrlUpdateFailedError);

    expect(getUrlByShortCodeRepository.findByShortCode).toHaveBeenCalledWith(mockShortCode);
    expect(updateUrlOriginalUrlRepository.update).toHaveBeenCalledWith(urlEntity);
  });
});
