import { Module } from '@nestjs/common';
import { UrlController } from './controllers/url/url.controller';

@Module({
  controllers: [UrlController],
})
export class InterfaceModule {}
