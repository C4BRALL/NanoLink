import { UserEntity } from '../../entities/user.entity';

export interface CreateUserRepositoryInterface {
  save(data: UserEntity): Promise<UserEntity>;
}
