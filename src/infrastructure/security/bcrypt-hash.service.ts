import { Injectable } from '@nestjs/common';
import { HashInterface } from 'src/core/domain/hash/hash.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashService implements HashInterface {
  async hash(plain: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 6;
    return bcrypt.hash(plain, rounds);
  }

  async compare(plain: string, hashedString: string): Promise<boolean> {
    return bcrypt.compare(plain, hashedString);
  }
}
