import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { DeleteUrlRepositoryService } from 'src/infrastructure/database/repositories/url/delete-url-repository.service';
import { UrlModel } from 'src/infrastructure/database/models/url.model';
import { DatabaseErrorHandler } from 'src/infrastructure/database/utils/db-error-handler';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { BadRequestException } from '@nestjs/common';

describe('DeleteUrlRepositoryService', () => {
  let service: DeleteUrlRepositoryService;
  let repository: jest.Mocked<Repository<UrlModel>>;
  let errorHandler: jest.Mocked<DatabaseErrorHandler>;

  const mockUrlId = '019698ec-5074-7f93-a85f-c534d2a1c82d';
  const mockShortCode = 'abc123';
  const mockUserId = '019698ea-ba2b-7332-aac4-3e6f4838d760';
  const now = new Date();

  beforeEach(async () => {
    const repositoryMock = {
      update: jest.fn(),
      findOne: jest.fn(),
    };

    const errorHandlerMock = {
      handleError: jest.fn((error) => {
        throw error;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUrlRepositoryService,
        {
          provide: getRepositoryToken(UrlModel),
          useValue: repositoryMock,
        },
        {
          provide: DatabaseErrorHandler,
          useValue: errorHandlerMock,
        },
      ],
    }).compile();

    service = module.get<DeleteUrlRepositoryService>(DeleteUrlRepositoryService);
    repository = module.get(getRepositoryToken(UrlModel)) as jest.Mocked<Repository<UrlModel>>;
    errorHandler = module.get<DatabaseErrorHandler>(DatabaseErrorHandler) as jest.Mocked<DatabaseErrorHandler>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('delete', () => {
    it('should update the URL with delete information', async () => {
      const deletedDate = new Date();
      const urlEntity = new UrlEntity({
        id: mockUrlId,
        shortCode: mockShortCode,
        originalUrl: 'https://www.example.com',
        userId: mockUserId,
        createdAt: now,
        updatedAt: now,
        deletedAt: deletedDate,
      });

      const updateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: [],
      };
      repository.update.mockResolvedValue(updateResult);

      const result = await service.delete(urlEntity);

      expect(repository.update).toHaveBeenCalledWith(mockUrlId, {
        deletedAt: deletedDate,
        updatedAt: urlEntity.updatedAt,
      });
      expect(result).toEqual(urlEntity);
    });

    it('should throw error when URL could not be updated (not found)', async () => {
      const deletedDate = new Date();
      const urlEntity = new UrlEntity({
        id: mockUrlId,
        shortCode: mockShortCode,
        originalUrl: 'https://www.example.com',
        userId: mockUserId,
        createdAt: now,
        updatedAt: now,
        deletedAt: deletedDate,
      });

      const updateResult: UpdateResult = {
        affected: 0,
        raw: {},
        generatedMaps: [],
      };
      repository.update.mockResolvedValue(updateResult);

      await expect(service.delete(urlEntity)).rejects.toThrow(BadRequestException);
      expect(repository.update).toHaveBeenCalledWith(mockUrlId, {
        deletedAt: deletedDate,
        updatedAt: urlEntity.updatedAt,
      });
    });

    it('should handle and propagate database errors', async () => {
      const deletedDate = new Date();
      const urlEntity = new UrlEntity({
        id: mockUrlId,
        shortCode: mockShortCode,
        originalUrl: 'https://www.example.com',
        userId: mockUserId,
        createdAt: now,
        updatedAt: now,
        deletedAt: deletedDate,
      });

      const dbError = new Error('Database connection error');
      repository.update.mockRejectedValue(dbError);

      const handledError = new Error('Handled database error');
      errorHandler.handleError.mockImplementationOnce(() => {
        throw handledError;
      });

      await expect(service.delete(urlEntity)).rejects.toThrow(handledError);
      expect(repository.update).toHaveBeenCalledWith(mockUrlId, {
        deletedAt: deletedDate,
        updatedAt: urlEntity.updatedAt,
      });
      expect(errorHandler.handleError).toHaveBeenCalledWith(dbError, 'URL');
    });
  });
});
