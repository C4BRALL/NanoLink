import { Module } from '@nestjs/common';
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
  providers: [DatabaseErrorHandler],
  exports: [DatabaseErrorHandler],
})
export class DatabaseModule {}
