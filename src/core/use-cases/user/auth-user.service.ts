import { Inject, Injectable } from '@nestjs/common';
import { AuthUserInterface } from 'src/core/domain/use-cases/user/auth-user.interface';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';
import { HashInterface } from 'src/core/domain/hash/hash.interface';
import { GetUserByEmailRepositoryInterface } from 'src/core/domain/repositories/user/get-user-by-email-repository.interface';
import { InvalidUserDataError } from 'src/core/errors/user-error';

@Injectable()
export class AuthUserService implements AuthUserInterface {
  constructor(
    @Inject('GetUserByEmailRepositoryInterface')
    private readonly userRepository: GetUserByEmailRepositoryInterface,
    @Inject('HashInterface')
    private readonly hash: HashInterface,
    @Inject('JwtInterface')
    private readonly jwt: JwtInterface,
  ) {}

  async execute(params: AuthUserInterface.Params): Promise<AuthUserInterface.output> {
    const user = await this.userRepository.findByEmail(params.email);
    const valid = await this.hash.compare(params.password, user.password);
    if (!valid) {
      throw new InvalidUserDataError(params.email);
    }
    const token = this.jwt.sign({ sub: user.id });
    return { user: user.getUserData(), token };
  }
}
