import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUrlRepositoryService } from './database/repositories/url/create-url-repository.service';
import { UrlModel } from './database/models/url.model';
import { DatabaseErrorHandler } from './database/utils/db-error-handler';
import { GetUrlByShortCodeRepositoryService } from './database/repositories/url/get-url-by-shortcode-repository.service';
import { UpdateUrlClickCountRepositoryService } from './database/repositories/url/update-url-clickcount-repository.service';
import { ConfigurationModule } from './config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([UrlModel]), ConfigurationModule, LoggerModule],
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
    LoggerModule,
  ],
})
export class InfrastructureModule {}
