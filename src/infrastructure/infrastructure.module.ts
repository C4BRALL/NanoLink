import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUrlRepositoryService } from './database/repositories/url/create-url-repository.service';
import { UrlModel } from './database/models/url.model';
import { DatabaseErrorHandler } from './database/utils/db-error-handler';
import { GetUrlByShortCodeRepositoryService } from './database/repositories/url/get-url-by-shortcode-repository.service';
import { UpdateUrlClickCountRepositoryService } from './database/repositories/url/update-url-clickcount-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([UrlModel])],
  providers: [
    {
      provide: 'CreateUrlRepositoryInterface',
      useClass: CreateUrlRepositoryService,
    },
    {
      provide: 'GetUrlByShortCodeRepositoryInterface',
      useClass: GetUrlByShortCodeRepositoryService,
    },
    {
      provide: 'UpdateUrlClickCountRepositoryInterface',
      useClass: UpdateUrlClickCountRepositoryService,
    },
    DatabaseErrorHandler,
  ],
  exports: [
    'CreateUrlRepositoryInterface',
    'GetUrlByShortCodeRepositoryInterface',
    'UpdateUrlClickCountRepositoryInterface',
    DatabaseErrorHandler,
  ],
})
export class InfrastructureModule {}
