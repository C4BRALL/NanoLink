import { UserEntity } from '../entities/user.entity';

export interface AuthUserInterface {
  execute(params: AuthUserInterface.Params): Promise<AuthUserInterface.output>;
}

export namespace AuthUserInterface {
  export type Params = {
    email: string;
    password: string;
  };

  export type output = {
    user: Omit<UserEntity, 'id' | 'password' | 'softDelete' | 'restore' | 'update' | 'isDeleted' | 'getUserData'>;
    token: string;
  };
}
