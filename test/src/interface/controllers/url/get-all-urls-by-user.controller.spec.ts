import { Test, TestingModule } from '@nestjs/testing';
import { GetAllUrlsByUserController } from 'src/interface/controllers/url/get-all-urls-by-user.controller';
import { GetAllUrlsByUserService } from 'src/core/use-cases/url/get-all-urls-by-user.service';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/interface/guards/auth.guard';

describe('GetAllUrlsByUserController', () => {
  let controller: GetAllUrlsByUserController;
  let service: jest.Mocked<GetAllUrlsByUserService>;

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as jest.Mocked<Response>;

  beforeEach(async () => {
    service = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetAllUrlsByUserController],
      providers: [
        {
          provide: GetAllUrlsByUserService,
          useValue: service,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<GetAllUrlsByUserController>(GetAllUrlsByUserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return URLs for authenticated user', async () => {
    const userId = '019698ea-ba2b-7332-aac4-3e6f4838d760';
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

    const mockRequest = {
      user: {
        userId,
      },
    } as unknown as Request;

    service.execute.mockResolvedValue(urls);

    await controller.getAllUrlsByUser(mockRequest, mockResponse);

    expect(service.execute).toHaveBeenCalledWith(userId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(urls);
  });

  it('should throw InvalidUserDataError when userId is invalid', async () => {
    const mockRequest = {
      user: {},
    } as unknown as Request;

    await expect(controller.getAllUrlsByUser(mockRequest, mockResponse)).rejects.toThrow(InvalidUserDataError);

    expect(service.execute).not.toHaveBeenCalled();
  });

  it('should return empty array when user has no URLs', async () => {
    const userId = '019698ea-ba2b-7332-aac4-3e6f4838d760';
    const mockRequest = {
      user: {
        userId,
      },
    } as unknown as Request;

    service.execute.mockResolvedValue([]);

    await controller.getAllUrlsByUser(mockRequest, mockResponse);

    expect(service.execute).toHaveBeenCalledWith(userId);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith([]);
  });

  it('should propagate service errors', async () => {
    const userId = '019698ea-ba2b-7332-aac4-3e6f4838d760';
    const serviceError = new Error('Service error');

    const mockRequest = {
      user: {
        userId,
      },
    } as unknown as Request;

    service.execute.mockRejectedValue(serviceError);

    await expect(controller.getAllUrlsByUser(mockRequest, mockResponse)).rejects.toThrow(serviceError);
  });
});
