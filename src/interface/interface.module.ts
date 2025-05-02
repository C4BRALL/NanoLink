import { Module } from '@nestjs/common';
import { CreateUrlController } from './controllers/url/create-url.controller';
import { UseCasesModule } from 'src/core/use-cases/use-cases.module';
import { ShortUrlController } from './controllers/url/short-url.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [CreateUrlController, ShortUrlController],
})
export class InterfaceModule {}
