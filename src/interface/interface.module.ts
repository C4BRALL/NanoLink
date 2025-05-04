import { Module } from '@nestjs/common';
import { CreateUrlController } from './controllers/url/create-url.controller';
import { UseCasesModule } from 'src/core/use-cases/use-cases.module';
import { ShortUrlController } from './controllers/url/short-url.controller';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { CreateUserController } from './controllers/user/create-user.controller';
import { AuthController } from './controllers/user/auth.controller';

@Module({
  imports: [UseCasesModule, InfrastructureModule],
  controllers: [CreateUrlController, ShortUrlController, CreateUserController, AuthController],
})
export class InterfaceModule {}
