import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { environmentConfigSchema } from '../environment-config/environment-config.schema';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService<environmentConfigSchema, true>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const useSSL: boolean = this.configService.get('DB_USE_SSL');

    const baseOptions: TypeOrmModuleOptions = {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: parseInt(this.configService.get('DB_PORT')),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [__dirname + '/../../database/models/**/*.model{.ts,.js}'],
      logging: this.configService.get('DB_LOGGING'),
      synchronize: this.configService.get('DB_TYPEORM_SYNC'),
    };

    if (useSSL) {
      return {
        ...baseOptions,
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }

    return baseOptions;
  }
}
