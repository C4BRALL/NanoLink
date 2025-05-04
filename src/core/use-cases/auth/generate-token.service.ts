import { Inject, Injectable } from '@nestjs/common';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';

@Injectable()
export class GenerateTokenService {
  constructor(
    @Inject('JwtInterface')
    private readonly jwt: JwtInterface,
  ) {}

  async execute(userId: string, extraPayload?: Record<string, any>): Promise<string> {
    const payload = { sub: userId, ...extraPayload };
    return this.jwt.sign(payload);
  }
}
