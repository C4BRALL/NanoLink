import { Module } from '@nestjs/common';
import { CreateUrlController } from './controllers/url/create-url.controller';
import { UseCasesModule } from 'src/core/use-cases/use-cases.module';
import { ShortUrlController } from './controllers/url/short-url.controller';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { CreateUserController } from './controllers/user/create-user.controller';
import { AuthController } from './controllers/user/auth.controller';
import { GetAllUrlsByUserController } from './controllers/url/get-all-urls-by-user.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthModule } from 'src/infrastructure/auth/auth.module';
import { DeleteUrlController } from './controllers/url/delete-url.controller';

@Module({
  imports: [UseCasesModule, InfrastructureModule, AuthModule],
  controllers: [
    CreateUrlController,
    ShortUrlController,
    CreateUserController,
    AuthController,
    GetAllUrlsByUserController,
    DeleteUrlController,
  ],
  providers: [AuthGuard],
})
export class InterfaceModule {}
