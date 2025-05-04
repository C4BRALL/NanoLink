import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { CreateUrlService } from 'src/core/use-cases/url/create-url.service';
import { CreateUrlDto, CreateUrlSchema, CreateUrlDtoClass } from 'src/interface/dtos/url/create-url.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiCookieAuth, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUrlResponseSwagger } from 'src/infrastructure/documentation/swagger/swagger-config/url-swagger.models';
import { ValidationErrorResponse } from 'src/infrastructure/documentation/swagger/swagger-config/error-swagger.models';
import { Request, Response } from 'express';
import { UrlCreationFailedError } from 'src/core/errors/url-error';
import { AuthTokenInterface } from 'src/core/domain/auth/auth-token.interface';
import { Public } from 'src/interface/decorators/public.decorator';

@ApiTags('URLs')
@Controller('url')
export class CreateUrlController {
  constructor(
    private readonly createUrlService: CreateUrlService,
    @Inject('AuthTokenServiceInterface')
    private readonly authService: AuthTokenInterface,
  ) {}

  @Public()
  @Post('/create')
  @ApiCookieAuth('token')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create shortened URL',
    description: 'Creates a shortened URL from an original URL. If authenticated, the URL will be associated with the user.',
  })
  @ApiBody({
    type: CreateUrlDtoClass,
    description: 'URL creation data',
    examples: {
      urlOnly: {
        summary: 'Public URL creation',
        value: {
          originalUrl: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
        },
      },
      withUser: {
        summary: 'URL with user ID (typically provided by token)',
        description: 'When authenticated, user ID is extracted from the token',
        value: {
          originalUrl: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
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
    description: 'Invalid input data',
    type: ValidationErrorResponse,
  })
  async createUrl(@Req() req: Request, @Body() body: CreateUrlDto, @Res() res: Response) {
    const checkBody = CreateUrlSchema.safeParse(body);
    if (!checkBody.success) {
      const errorMessage = checkBody.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');

      throw new UrlCreationFailedError(errorMessage);
    }

    const userId = await this.authService.tryGetUserIdFromRequest(req);

    const url = await this.createUrlService.execute({
      originalUrl: body.originalUrl,
      userId: userId ? userId : undefined,
    });

    res.status(201).json(url);
  }
}
