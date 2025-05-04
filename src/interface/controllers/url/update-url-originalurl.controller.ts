import { Body, Controller, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { InvalidShortCodeError } from 'src/core/errors/url-error';
import { UpdateUrlOriginalUrlService } from 'src/core/use-cases/url/update-url-originalurl.service';
import { UpdateUrlOriginalUrlDtoClass, UpdateUrlOriginalUrlSchema } from 'src/interface/dtos/url/update-url-originalurl.dto';
import { AuthGuard } from 'src/interface/guards/auth.guard';
import { UpdateUrlResponseSwagger } from 'src/infrastructure/documentation/swagger/swagger-config/url-swagger.models';
import {
  NotFoundErrorResponse,
  ValidationErrorResponse,
} from 'src/infrastructure/documentation/swagger/swagger-config/error-swagger.models';

@ApiTags('URLs')
@Controller('url')
export class UpdateUrlOriginalUrlController {
  constructor(private readonly updateUrlOriginalUrlService: UpdateUrlOriginalUrlService) {}

  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  @ApiBearerAuth()
  @Put('/:shortCode')
  @ApiOperation({
    summary: 'Update original URL',
    description: 'Updates the original URL of a shortened URL. Only authenticated users can update URLs they own.',
  })
  @ApiParam({
    name: 'shortCode',
    required: true,
    description: 'The short code of the URL to update',
    type: String,
    example: 'abc123',
  })
  @ApiBody({
    type: UpdateUrlOriginalUrlDtoClass,
    description: 'URL update data',
  })
  @ApiResponse({
    status: 200,
    description: 'URL updated successfully',
    type: UpdateUrlResponseSwagger,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data', type: ValidationErrorResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not own this URL' })
  @ApiResponse({ status: 404, description: 'URL not found', type: NotFoundErrorResponse })
  async updateUrlOriginalUrl(
    @Req() req: Request,
    @Param('shortCode') shortCode: string,
    @Body() body: { originalUrl: string },
    @Res() res: Response,
  ) {
    const checkBody = UpdateUrlOriginalUrlSchema.safeParse({ shortCode, originalUrl: body.originalUrl });
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    if (!checkBody.success) {
      const errorMessage = checkBody.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new InvalidShortCodeError(errorMessage);
    }

    const url = await this.updateUrlOriginalUrlService.execute({
      shortCode: checkBody.data.shortCode,
      originalUrl: checkBody.data.originalUrl,
      userId: userId,
    });

    res.status(200).json({
      message: 'URL updated successfully',
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
    });
  }
}
