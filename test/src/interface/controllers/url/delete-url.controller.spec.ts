import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUrlController } from 'src/interface/controllers/url/delete-url.controller';
import { DeleteUrlService } from 'src/core/use-cases/url/delete-url.service';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { Reflector } from '@nestjs/core';
import { InvalidShortCodeError } from 'src/core/errors/url-error';
import { UrlDeletionFailedError } from 'src/core/use-cases/errors/url-error';
import { AuthGuard } from 'src/interface/guards/auth.guard';
import { Response } from 'express';

describe('DeleteUrlController', () => {
  let controller: DeleteUrlController;
  let deleteUrlService: jest.Mocked<DeleteUrlService>;

  const mockShortCode = 'abc123';
  const mockUserId = '019698ea-ba2b-7332-aac4-3e6f4838d760';
  const mockUrlId = '019698ec-5074-7f93-a85f-c534d2a1c82d';

  beforeEach(async () => {
    const deleteUrlServiceMock = {
      execute: jest.fn(),
    };

    const authTokenServiceMock = {
      validateToken: jest.fn(),
      extractTokenFromCookie: jest.fn(),
      extractTokenFromAuthHeader: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteUrlController],
      providers: [
        {
          provide: DeleteUrlService,
          useValue: deleteUrlServiceMock,
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: 'AuthTokenServiceInterface',
          useValue: authTokenServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DeleteUrlController>(DeleteUrlController);
    deleteUrlService = module.get(DeleteUrlService) as jest.Mocked<DeleteUrlService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      deletedAt: now,
    });

    deleteUrlService.execute.mockResolvedValue(urlEntity);

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await controller.deleteUrl(mockShortCode, mockResponse);

    expect(deleteUrlService.execute).toHaveBeenCalledWith({ shortCode: mockShortCode });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'URL deleted successfully',
      shortCode: mockShortCode,
      originalUrl: 'https://www.example.com',
    });
  });

  it('should throw InvalidShortCodeError for invalid shortCode', async () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.deleteUrl('', mockResponse)).rejects.toThrow(InvalidShortCodeError);

    expect(deleteUrlService.execute).not.toHaveBeenCalled();
  });

  it('should propagate service errors', async () => {
    deleteUrlService.execute.mockRejectedValue(new UrlDeletionFailedError(mockShortCode, new Error('Service error')));

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await expect(controller.deleteUrl(mockShortCode, mockResponse)).rejects.toThrow(UrlDeletionFailedError);

    expect(deleteUrlService.execute).toHaveBeenCalledWith({ shortCode: mockShortCode });
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
