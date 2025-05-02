import { Module } from '@nestjs/common';
import { CreateUrlRepositoryService } from './repositories/url/create-url-repository.service';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from '../config/database-config/database-config.service';
import { UrlModel } from './models/url.model';
import { DatabaseErrorHandler } from './utils/db-error-handler';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      imports: [ConfigurationModule],
    }),
    TypeOrmModule.forFeature([UrlModel]),
  ],
  providers: [
    {
      provide: 'CreateUrlRepositoryInterface',
      useClass: CreateUrlRepositoryService,
    },
    DatabaseErrorHandler,
  ],
  exports: ['CreateUrlRepositoryInterface', DatabaseErrorHandler],
})
export class DatabaseModule {}
