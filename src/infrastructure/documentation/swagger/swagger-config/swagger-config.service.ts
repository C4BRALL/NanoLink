import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

@Injectable()
export class SwaggerConfigService {
  setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Nano Link - URL Shortener API')
      .setDescription('URL Shortening API')
      .setVersion('1.0')
      .addTag('auth', 'Authentication')
      .addTag('urls', 'URL Management')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
}
