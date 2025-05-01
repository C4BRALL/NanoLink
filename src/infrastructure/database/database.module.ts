import { Module } from '@nestjs/common';
import { CreateUrlRepositoryService } from './repositories/url-repository/create-url-repository.service';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from '../config/database-config/database-config.service';
import { UrlModel } from './models/url.model';

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
  ],
  exports: ['CreateUrlRepositoryInterface'],
})
export class DatabaseModule {}
