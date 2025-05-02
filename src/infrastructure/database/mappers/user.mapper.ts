import { UserEntity } from '../../../core/domain/entities/user.entity';
import { UserModel } from '../models/user.model';

export class UserMapper {
  static toDomain(model: UserModel): UserEntity {
    return new UserEntity({
      id: model.id,
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  static toPersistence(entity: UserEntity): UserModel {
    const model = new UserModel();
    model.id = entity.id;
    model.name = entity.name;
    model.email = entity.email;
    model.password = entity.password;
    model.createdAt = entity.createdAt;
    model.updatedAt = entity.updatedAt;
    model.deletedAt = entity.deletedAt;
    return model;
  }
}
