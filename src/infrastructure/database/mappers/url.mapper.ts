import { UrlEntity } from '../../../core/domain/entities/url.entity';
import { UrlModel } from '../models/url.model';

export class UrlMapper {
  static toDomain(model: UrlModel): UrlEntity {
    return new UrlEntity({
      id: model.id,
      shortCode: model.shortCode,
      originalUrl: model.originalUrl,
      userId: model.userId,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
      clickCount: model.clickCount,
      lastClickDate: model.lastClickDate,
    });
  }

  static toPersistence(entity: UrlEntity): UrlModel {
    const model = new UrlModel();
    model.id = entity.id;
    model.shortCode = entity.shortCode;
    model.originalUrl = entity.originalUrl;
    model.userId = entity.userId;
    model.clickCount = entity.clickCount;
    model.lastClickDate = entity.lastClickDate;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    model.deletedAt = entity.deletedAt;
    return model;
  }
}
