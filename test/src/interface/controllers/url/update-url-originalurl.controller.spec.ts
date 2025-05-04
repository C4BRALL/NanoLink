import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUrlOriginalUrlController } from 'src/interface/controllers/url/update-url-originalurl.controller';
import { UpdateUrlOriginalUrlService } from 'src/core/use-cases/url/update-url-originalurl.service';
import { InvalidShortCodeError } from 'src/core/errors/url-error';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UrlAccessDeniedError, UrlUpdateFailedError } from 'src/core/use-cases/errors/url-error';
import { AuthGuard } from 'src/interface/guards/auth.guard';
import { Request, Response } from 'express';

describe('UpdateUrlOriginalUrlController', () => {
  let controller: UpdateUrlOriginalUrlController;
  let updateUrlOriginalUrlService: jest.Mocked<UpdateUrlOriginalUrlService>;

  const mockShortCode = 'abc123';
  const mockUserId = '019698ea-ba2b-7332-aac4-3e6f4838d760';
  const mockUrlId = '019698ec-5074-7f93-a85f-c534d2a1c82d';
  const originalUrl = 'https://www.example.com';
  const newOriginalUrl = 'https://www.updated-example.com';

  beforeEach(async () => {
    const updateUrlOriginalUrlServiceMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUrlOriginalUrlController],
      providers: [
        {
          provide: UpdateUrlOriginalUrlService,
          useValue: updateUrlOriginalUrlServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UpdateUrlOriginalUrlController>(UpdateUrlOriginalUrlController);
    updateUrlOriginalUrlService = module.get(UpdateUrlOriginalUrlService) as jest.Mocked<UpdateUrlOriginalUrlService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update URL originalUrl successfully', async () => {
    const now = new Date();
    const urlEntity = new UrlEntity({
      id: mockUrlId,
      shortCode: mockShortCode,
      originalUrl: newOriginalUrl,
      userId: mockUserId,
      createdAt: now,
      updatedAt: now,
    });

    updateUrlOriginalUrlService.execute.mockResolvedValue(urlEntity);

    const mockRequest = {
      user: {
        userId: mockUserId,
      },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.updateUrlOriginalUrl(mockRequest, mockShortCode, { originalUrl: newOriginalUrl }, mockResponse);

    expect(updateUrlOriginalUrlService.execute).toHaveBeenCalledWith({
      shortCode: mockShortCode,
      originalUrl: newOriginalUrl,
      userId: mockUserId,
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'URL updated successfully',
      shortCode: mockShortCode,
      originalUrl: newOriginalUrl,
    });
  });

  it('should throw InvalidShortCodeError for invalid shortCode', async () => {
    const mockRequest = {
      user: {
        userId: mockUserId,
      },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.updateUrlOriginalUrl(mockRequest, '', { originalUrl: newOriginalUrl }, mockResponse)).rejects.toThrow(
      InvalidShortCodeError,
    );

    expect(updateUrlOriginalUrlService.execute).not.toHaveBeenCalled();
  });

  it('should throw InvalidShortCodeError for invalid originalUrl', async () => {
    const mockRequest = {
      user: {
        userId: mockUserId,
      },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.updateUrlOriginalUrl(mockRequest, mockShortCode, { originalUrl: 'invalid-url' }, mockResponse)).rejects.toThrow(
      InvalidShortCodeError,
    );

    expect(updateUrlOriginalUrlService.execute).not.toHaveBeenCalled();
  });

  it('should propagate UrlAccessDeniedError from service', async () => {
    updateUrlOriginalUrlService.execute.mockRejectedValue(new UrlAccessDeniedError(mockShortCode, mockUserId));

    const mockRequest = {
      user: {
        userId: mockUserId,
      },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(
      controller.updateUrlOriginalUrl(mockRequest, mockShortCode, { originalUrl: newOriginalUrl }, mockResponse),
    ).rejects.toThrow(UrlAccessDeniedError);

    expect(updateUrlOriginalUrlService.execute).toHaveBeenCalledWith({
      shortCode: mockShortCode,
      originalUrl: newOriginalUrl,
      userId: mockUserId,
    });
  });

  it('should propagate UrlUpdateFailedError from service', async () => {
    updateUrlOriginalUrlService.execute.mockRejectedValue(new UrlUpdateFailedError(mockShortCode, new Error('Update failed')));

    const mockRequest = {
      user: {
        userId: mockUserId,
      },
    } as unknown as Request;

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(
      controller.updateUrlOriginalUrl(mockRequest, mockShortCode, { originalUrl: newOriginalUrl }, mockResponse),
    ).rejects.toThrow(UrlUpdateFailedError);

    expect(updateUrlOriginalUrlService.execute).toHaveBeenCalledWith({
      shortCode: mockShortCode,
      originalUrl: newOriginalUrl,
      userId: mockUserId,
    });
  });
});
