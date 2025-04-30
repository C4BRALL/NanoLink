import { Module } from '@nestjs/common';
import { CreateUrlService } from './create-url/create-url.service';
import { GetUrlService } from './get-url/get-url.service';

@Module({
  providers: [CreateUrlService, GetUrlService],
})
export class UseCasesModule {}
