import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUrlRepositoryService } from './database/repositories/url-repository/create-url-repository.service';
import { UrlModel } from './database/models/url.model';

@Module({
  imports: [TypeOrmModule.forFeature([UrlModel])],
  providers: [
    {
      provide: 'CreateUrlRepositoryInterface',
      useClass: CreateUrlRepositoryService,
    },
  ],
  exports: ['CreateUrlRepositoryInterface'],
})
export class InfrastructureModule {}
