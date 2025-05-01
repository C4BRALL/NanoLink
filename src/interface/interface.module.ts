import { Module } from '@nestjs/common';
import { CreateUrlController } from './controllers/url/create-url.controller';
import { UseCasesModule } from 'src/core/use-cases/use-cases.module';

@Module({
  imports: [UseCasesModule],
  controllers: [CreateUrlController],
})
export class InterfaceModule {}
