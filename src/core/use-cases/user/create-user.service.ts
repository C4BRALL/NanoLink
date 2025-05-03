import { Inject, Injectable } from '@nestjs/common';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { HashInterface } from 'src/core/domain/hash/hash.interface';
import { CreateUserRepositoryInterface } from 'src/core/domain/repositories/user/create-user-repository.interface';
import { CreateUserInterface } from 'src/core/domain/use-cases/user/create-user.interface';
import { InvalidUserDataError } from 'src/core/errors/user-error';

@Injectable()
export class CreateUserService implements CreateUserInterface {
  constructor(
    @Inject('CreateUserRepositoryInterface')
    private readonly userRepository: CreateUserRepositoryInterface,
    @Inject('HashInterface')
    private readonly hash: HashInterface,
    @Inject('JwtInterface')
    private readonly jwt: JwtInterface,
  ) {}

  async execute(params: CreateUserInterface.Params): Promise<CreateUserInterface.Output> {
    try {
      const hashedPassword = await this.hash.hash(params.password);

      const user = new UserEntity({
        name: params.name,
        email: params.email,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(user);

      const token = this.jwt.sign({ id: user.id });

      return { user: savedUser.getUserData(), token };
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidUserDataError(error.message);
      }
      throw error;
    }
  }
}
