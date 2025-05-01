import { Module } from '@nestjs/common';
import { CreateUrlService } from './url/create-url.service';
import { GetUrlService } from './url/get-url.service';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [CreateUrlService, GetUrlService],
  exports: [CreateUrlService, GetUrlService],
})
export class UseCasesModule {}
