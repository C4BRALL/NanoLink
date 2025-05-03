import { UserEntity } from '../../entities/user.entity';

export interface CreateUserInterface {
  execute(user: CreateUserInterface.Params): Promise<CreateUserInterface.Output>;
}

export namespace CreateUserInterface {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    user: Omit<UserEntity, 'id' | 'password' | 'softDelete' | 'restore' | 'update' | 'isDeleted' | 'getUserData'>;
    token: string;
  };
}
