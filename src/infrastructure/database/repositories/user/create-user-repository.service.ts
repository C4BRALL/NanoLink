import { Injectable } from '@nestjs/common';
import { CreateUserRepositoryInterface } from 'src/core/domain/repositories/user/create-user-repository.interface';
import { UserModel } from '../../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { UserMapper } from '../../mappers/user.mapper';

@Injectable()
export class CreateUserRepositoryService implements CreateUserRepositoryInterface {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}

  async save(data: UserEntity): Promise<UserEntity> {
    try {
      const userModel = UserMapper.toPersistence(data);
      const user = await this.userRepository.save(userModel);
      return UserMapper.toDomain(user);
    } catch (error) {
      throw this.errorHandler.handleError(error, 'USER');
    }
  }
}
