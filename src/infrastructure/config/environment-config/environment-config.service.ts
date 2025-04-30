import { Injectable } from '@nestjs/common';
import { environmentConfigSchema } from './environment-config.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentConfigService {
  constructor(private readonly configService: ConfigService<environmentConfigSchema, true>) {}

  get<T extends keyof environmentConfigSchema>(key: T): environmentConfigSchema[T] {
    return this.configService.get(key);
  }
}
