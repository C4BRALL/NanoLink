import { Module } from '@nestjs/common';
import { CreateUrlService } from './url/create-url.service';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { ConfigurationModule } from 'src/infrastructure/config/config.module';
import { GetUrlByShortCodeService } from './url/get-url-by-shortcode.service';

@Module({
  imports: [InfrastructureModule, ConfigurationModule],
  providers: [CreateUrlService, GetUrlByShortCodeService],
  exports: [CreateUrlService, GetUrlByShortCodeService],
})
export class UseCasesModule {}
