import { Module } from '@nestjs/common';
import { CreateUrlService } from './url/create-url.service';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { ConfigurationModule } from 'src/infrastructure/config/config.module';
import { GetUrlByShortCodeService } from './url/get-url-by-shortcode.service';
import { CreateUserService } from './user/create-user.service';
import { GenerateTokenService } from './auth/generate-token.service';
import { AuthModule } from 'src/infrastructure/auth/auth.module';
import { AuthUserService } from './user/auth-user.service';

@Module({
  imports: [InfrastructureModule, ConfigurationModule, AuthModule],
  providers: [CreateUrlService, GetUrlByShortCodeService, CreateUserService, GenerateTokenService, AuthUserService],
  exports: [CreateUrlService, GetUrlByShortCodeService, CreateUserService, GenerateTokenService, AuthUserService],
})
export class UseCasesModule {}
