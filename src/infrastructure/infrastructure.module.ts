import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUrlRepositoryService } from './database/repositories/url/create-url-repository.service';
import { UrlModel } from './database/models/url.model';
import { DatabaseErrorHandler } from './database/utils/db-error-handler';

@Module({
  imports: [TypeOrmModule.forFeature([UrlModel])],
  providers: [
    {
      provide: 'CreateUrlRepositoryInterface',
      useClass: CreateUrlRepositoryService,
    },
    DatabaseErrorHandler,
  ],
  exports: ['CreateUrlRepositoryInterface', DatabaseErrorHandler],
})
export class InfrastructureModule {}
