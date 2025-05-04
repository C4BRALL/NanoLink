import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';

@Injectable()
export class JwtService implements JwtInterface {
  constructor(private readonly jwt: NestJwtService) {}

  sign<T extends object>(payload: T): string {
    return this.jwt.sign(payload);
  }

  verify<T extends object>(token: string): T {
    return this.jwt.verify(token);
  }
}
