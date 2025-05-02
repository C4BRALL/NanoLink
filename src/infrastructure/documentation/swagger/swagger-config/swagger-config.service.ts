import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { CreateUrlDtoClass } from 'src/interface/dtos/url/create-url.dto';
import { ShortUrlDtoClass } from 'src/interface/dtos/url/short-url.dto';
import { ApiErrorResponse, NotFoundErrorResponse, ValidationErrorResponse } from '../swagger-config/error-swagger.models';
import { CreateUrlResponseSwagger, UrlEntitySwagger } from '../swagger-config/url-swagger.models';

@Injectable()
export class SwaggerConfigService {
  setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Nano Link - URL Shortener API')
      .setDescription('API for shortening URLs with click counting')
      .setVersion('1.0')
      .addTag('URLs', 'URLs management')
      .addTag('Redirection', 'Redirection to original URLs')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [
        CreateUrlDtoClass,
        ShortUrlDtoClass,
        ApiErrorResponse,
        NotFoundErrorResponse,
        ValidationErrorResponse,
        UrlEntitySwagger,
        CreateUrlResponseSwagger,
      ],
    });

    SwaggerModule.setup('api/docs', app, document);
  }
}
