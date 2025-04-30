import { Module } from '@nestjs/common';
import { UrlRepositoryService } from './repositories/url-repository/url-repository.service';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from '../config/database-config/database-config.service';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      imports: [ConfigurationModule],
    }),
  ],
  providers: [UrlRepositoryService],
})
export class DatabaseModule {}
