import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { CreateUrlDtoClass } from 'src/interface/dtos/url/create-url.dto';
import { ShortUrlDtoClass } from 'src/interface/dtos/url/short-url.dto';
import { ApiErrorResponse, NotFoundErrorResponse, ValidationErrorResponse } from '../swagger-config/error-swagger.models';
import { CreateUrlResponseSwagger, UrlEntitySwagger } from '../swagger-config/url-swagger.models';
import { LoginDtoClass } from 'src/interface/dtos/user/login-dto';
import { CreateUserDtoClass } from 'src/interface/dtos/user/create-user.dto';
import { CreateUserResponseSwagger, LoginResponseSwagger, UserEntitySwagger } from './user-swagger.models';

@Injectable()
export class SwaggerConfigService {
  setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Nano Link - URL Shortener API')
      .setDescription('API for shortening URLs with click counting')
      .setVersion('1.0')
      .addTag('URLs', 'URLs management')
      .addTag('Redirection', 'Redirection to original URLs')
      .addTag('Users', 'Users management')
      .addTag('Authentication', 'Authentication')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [
        CreateUrlDtoClass,
        ShortUrlDtoClass,
        LoginDtoClass,
        CreateUserDtoClass,
        ApiErrorResponse,
        NotFoundErrorResponse,
        ValidationErrorResponse,
        UrlEntitySwagger,
        CreateUrlResponseSwagger,
        CreateUserResponseSwagger,
        LoginResponseSwagger,
        UserEntitySwagger,
      ],
    });

    SwaggerModule.setup('api/docs', app, document);
  }
}
