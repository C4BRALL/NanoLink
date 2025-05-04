import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUrlRepositoryService } from './database/repositories/url/create-url-repository.service';
import { UrlModel } from './database/models/url.model';
import { DatabaseErrorHandler } from './database/utils/db-error-handler';
import { GetUrlByShortCodeRepositoryService } from './database/repositories/url/get-url-by-shortcode-repository.service';
import { UpdateUrlClickCountRepositoryService } from './database/repositories/url/update-url-clickcount-repository.service';
import { ConfigurationModule } from './config/config.module';
import { CreateUserRepositoryService } from './database/repositories/user/create-user-repository.service';
import { BcryptHashService } from './security/bcrypt-hash.service';
import { UserModel } from './database/models/user.model';
import { GetUserByEmailRepositoryService } from './database/repositories/user/get-user-by-email-repository.service';
import { GetAllUrlsByUserRepositoryService } from './database/repositories/url/get-all-urls-by-user-repository.service';
import { DeleteUrlRepositoryService } from './database/repositories/url/delete-url-repository.service';

@Module({
  imports: [TypeOrmModule.forFeature([UrlModel, UserModel]), ConfigurationModule, LoggerModule],
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
    {
      provide: 'CreateUserRepositoryInterface',
      useClass: CreateUserRepositoryService,
    },
    {
      provide: 'HashInterface',
      useClass: BcryptHashService,
    },
    {
      provide: 'GetUserByEmailRepositoryInterface',
      useClass: GetUserByEmailRepositoryService,
    },
    {
      provide: 'GetAllUrlsByUserRepositoryInterface',
      useClass: GetAllUrlsByUserRepositoryService,
    },
    {
      provide: 'DeleteUrlRepositoryInterface',
      useClass: DeleteUrlRepositoryService,
    },
    DatabaseErrorHandler,
  ],
  exports: [
    'HashInterface',
    'CreateUrlRepositoryInterface',
    'GetUrlByShortCodeRepositoryInterface',
    'UpdateUrlClickCountRepositoryInterface',
    'CreateUserRepositoryInterface',
    'GetUserByEmailRepositoryInterface',
    'GetAllUrlsByUserRepositoryInterface',
    'DeleteUrlRepositoryInterface',
    DatabaseErrorHandler,
    LoggerModule,
  ],
})
export class InfrastructureModule {}
