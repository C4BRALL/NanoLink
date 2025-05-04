import { Module } from '@nestjs/common';
import { CreateUrlService } from './url/create-url.service';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { ConfigurationModule } from 'src/infrastructure/config/config.module';
import { GetUrlByShortCodeService } from './url/get-url-by-shortcode.service';
import { CreateUserService } from './user/create-user.service';
import { GenerateTokenService } from './auth/generate-token.service';
import { AuthModule } from 'src/infrastructure/auth/auth.module';
import { AuthUserService } from './user/auth-user.service';
import { GetAllUrlsByUserService } from './url/get-all-urls-by-user.service';
import { DeleteUrlService } from './url/delete-url.service';
import { UpdateUrlOriginalUrlService } from './url/update-url-originalurl.service';

@Module({
  imports: [InfrastructureModule, ConfigurationModule, AuthModule],
  providers: [
    CreateUrlService,
    GetUrlByShortCodeService,
    CreateUserService,
    GenerateTokenService,
    AuthUserService,
    GetAllUrlsByUserService,
    DeleteUrlService,
    UpdateUrlOriginalUrlService,
  ],
  exports: [
    CreateUrlService,
    GetUrlByShortCodeService,
    CreateUserService,
    GenerateTokenService,
    AuthUserService,
    GetAllUrlsByUserService,
    DeleteUrlService,
    UpdateUrlOriginalUrlService,
  ],
})
export class UseCasesModule {}
