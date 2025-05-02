import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { GetUrlByShortCodeService } from 'src/core/use-cases/url/get-url-by-shortcode.service';
import { Response } from 'express';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  NotFoundErrorResponse,
  ShortUrlValidationErrorResponse,
} from 'src/infrastructure/documentation/swagger/swagger-config/error-swagger.models';
import { ShortUrlSchema } from 'src/interface/dtos/url/short-url.dto';
import { InvalidShortCodeError } from 'src/core/errors/url-error';

@ApiTags('Redirection')
@Controller()
export class ShortUrlController {
  constructor(private readonly getUrlByShortCodeService: GetUrlByShortCodeService) {}

  @Get(':shortCode')
  @ApiOperation({
    summary: 'Redirect to original URL',
    description: 'Receives the short URL code and redirects to the original URL, counting the click',
  })
  @ApiParam({
    name: 'shortCode',
    type: 'string',
    description: 'Short URL code (6 characters)',
    example: 'aZbKq7',
  })
  @ApiResponse({
    status: 302,
    description: 'Successful redirection to the original URL',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
    type: NotFoundErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL data',
    type: ShortUrlValidationErrorResponse,
  })
  async urlShortCode(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const shortCodeSchema = ShortUrlSchema.safeParse({ shortCode });

    if (!shortCodeSchema.success) {
      const errorMessage = shortCodeSchema.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');

      throw new InvalidShortCodeError(errorMessage);
    }

    const result = await this.getUrlByShortCodeService.execute({ shortCode: shortCodeSchema.data.shortCode });

    if (result && result.originalUrl) {
      return res.status(302).redirect(result.originalUrl);
    } else {
      throw new NotFoundException(`URL with short code '${shortCode}' not found`);
    }
  }
}
