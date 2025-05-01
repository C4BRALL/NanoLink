import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UrlMapper } from 'src/infrastructure/database/mappers/url.mapper';
import { UrlModel } from 'src/infrastructure/database/models/url.model';

describe('UrlMapper', () => {
  describe('toDomain', () => {
    it('should correctly convert a UrlModel to a UrlEntity with all properties', () => {
      const mockModel = new UrlModel();
      mockModel.shortCode = 'abc123';
      mockModel.originalUrl = 'https://exemplo.com';
      mockModel.userId = 'b71f7100-f500-4fee-bdfc-594d4dcdd3da';
      mockModel.clickCount = 2;
      mockModel.lastClickDate = new Date();
      mockModel.createdAt = new Date();
      mockModel.updatedAt = new Date();

      const result = UrlMapper.toDomain(mockModel);

      expect(result).toBeInstanceOf(UrlEntity);
      expect(result).toEqual({
        id: expect.any(String),
        shortCode: mockModel.shortCode,
        originalUrl: mockModel.originalUrl,
        userId: expect.any(String),
        createdAt: mockModel.createdAt,
        updatedAt: mockModel.updatedAt,
        deletedAt: undefined,
        clickCount: 2,
        lastClickDate: mockModel.lastClickDate,
      });
    });

    it('should correctly convert a UrlModel to a UrlEntity without optional properties', () => {
      const mockModel = new UrlModel();
      mockModel.shortCode = 'abc123';
      mockModel.originalUrl = 'https://exemplo.com';
      mockModel.createdAt = new Date();
      mockModel.updatedAt = new Date();

      const result = UrlMapper.toDomain(mockModel);

      expect(result).toBeInstanceOf(UrlEntity);
      expect(result.shortCode).toBe(mockModel.shortCode);
      expect(result.originalUrl).toBe(mockModel.originalUrl);
      expect(result.userId).toBeUndefined();
      expect(result.clickCount).toBe(0);
      expect(result.lastClickDate).toBeUndefined();
      expect(result.createdAt).toStrictEqual(mockModel.createdAt);
      expect(result.updatedAt).toStrictEqual(mockModel.updatedAt);
      expect(result.deletedAt).toBeUndefined();
    });
  });

  describe('toPersistence', () => {
    it('should correctly convert a UrlEntity to a UrlModel with all properties', () => {
      const mockEntity = new UrlEntity({
        shortCode: 'abc123',
        originalUrl: 'https://exemplo.com',
        userId: 'b71f7100-f500-4fee-bdfc-594d4dcdd3da',
        clickCount: 2,
        lastClickDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = UrlMapper.toPersistence(mockEntity);

      expect(result).toBeInstanceOf(UrlModel);
      expect(result.shortCode).toBe(mockEntity.shortCode);
      expect(result.originalUrl).toBe(mockEntity.originalUrl);
      expect(result.userId).toBe(mockEntity.userId);
      expect(result.clickCount).toBe(2);
      expect(result.lastClickDate).toBe(mockEntity.lastClickDate);
      expect(result.createdAt).toBe(mockEntity.createdAt);
      expect(result.updatedAt).toBe(mockEntity.updatedAt);
      expect(result.deletedAt).toBeUndefined();
    });

    it('should correctly convert a UrlEntity to a UrlModel without optional properties', () => {
      const mockEntity = new UrlEntity({
        shortCode: 'abc123',
        originalUrl: 'https://exemplo.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = UrlMapper.toPersistence(mockEntity);

      expect(result).toBeInstanceOf(UrlModel);
      expect(result).toEqual({
        id: expect.any(String),
        shortCode: mockEntity.shortCode,
        originalUrl: mockEntity.originalUrl,
        userId: undefined,
        user: undefined,
        clickCount: 0,
        lastClickDate: undefined,
        createdAt: mockEntity.createdAt,
        updatedAt: mockEntity.updatedAt,
        deletedAt: undefined,
      });
    });
  });
});
