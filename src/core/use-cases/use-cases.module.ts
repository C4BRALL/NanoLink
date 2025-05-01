import { Module } from '@nestjs/common';
import { CreateUrlService } from './url/create-url.service';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { ConfigurationModule } from 'src/infrastructure/config/config.module';

@Module({
  imports: [InfrastructureModule, ConfigurationModule],
  providers: [CreateUrlService],
  exports: [CreateUrlService],
})
export class UseCasesModule {}
