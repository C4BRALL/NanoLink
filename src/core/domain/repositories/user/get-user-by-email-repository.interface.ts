import { UserEntity } from '../../entities/user.entity';

export interface GetUserByEmailRepositoryInterface {
  findByEmail(email: string): Promise<UserEntity>;
}
