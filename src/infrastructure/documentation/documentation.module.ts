import { Module } from '@nestjs/common';
import { SwaggerConfigService } from './swagger/swagger-config/swagger-config.service';

@Module({
  providers: [SwaggerConfigService],
})
export class DocumentationModule {}
