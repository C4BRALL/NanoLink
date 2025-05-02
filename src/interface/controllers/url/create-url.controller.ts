import { Body, Controller, Post, Res } from '@nestjs/common';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { CreateUrlService } from 'src/core/use-cases/url/create-url.service';
import { CreateUrlDto, CreateUrlSchema, CreateUrlDtoClass } from 'src/interface/dtos/url/create-url.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUrlResponseSwagger } from 'src/infrastructure/documentation/swagger/swagger-config/url-swagger.models';
import { ValidationErrorResponse } from 'src/infrastructure/documentation/swagger/swagger-config/error-swagger.models';
import { Response } from 'express';

@ApiTags('URLs')
@Controller('url')
export class CreateUrlController {
  constructor(private readonly createUrlService: CreateUrlService) {}

  @Post('/create')
  @ApiOperation({
    summary: 'Create a shortened URL',
    description: 'Receives an original URL and optionally a user ID, and returns the shortened URL',
  })
  @ApiBody({
    type: CreateUrlDtoClass,
    description: 'Data to create a shortened URL',
    examples: {
      urlOnly: {
        summary: 'Only URL (without authentication)',
        value: {
          originalUrl: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
        },
      },
      withUser: {
        summary: 'URL with authenticated user',
        value: {
          originalUrl: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
          userId: 'cc435f3c-6c26-40ef-abe8-635a475c8a7c',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Shortened URL created successfully',
    type: CreateUrlResponseSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data',
    type: ValidationErrorResponse,
  })
  async createUrl(@Body() body: CreateUrlDto, @Res() res: Response) {
    const result = CreateUrlSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');

      throw new InvalidUserDataError(errorMessage);
    }

    const url = await this.createUrlService.execute({
      originalUrl: body.originalUrl,
      userId: body.userId,
    });

    return res.status(201).json(url);
  }
}
