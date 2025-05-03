import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUserByEmailRepositoryInterface } from 'src/core/domain/repositories/user/get-user-by-email-repository.interface';
import { UserModel } from '../../models/user.model';
import { Repository } from 'typeorm';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { UserMapper } from '../../mappers/user.mapper';

@Injectable()
export class GetUserByEmailRepositoryService implements GetUserByEmailRepositoryInterface {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('User', email);
      }
      return UserMapper.toDomain(user);
    } catch (err) {
      throw this.errorHandler.handleError(err, 'USER');
    }
  }
}
