import { Controller, Delete, Inject, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { InvalidShortCodeError } from 'src/core/errors/url-error';
import { DeleteUrlService } from 'src/core/use-cases/url/delete-url.service';
import { DeleteUrlSchema } from 'src/interface/dtos/url/delete-url.dto';
import { AuthGuard } from 'src/interface/guards/auth.guard';
import { DeleteUrlResponseSwagger } from 'src/infrastructure/documentation/swagger/swagger-config/url-swagger.models';
import {
  NotFoundErrorResponse,
  ValidationErrorResponse,
} from 'src/infrastructure/documentation/swagger/swagger-config/error-swagger.models';

@ApiTags('URLs')
@Controller('url')
export class DeleteUrlController {
  constructor(private readonly deleteUrlService: DeleteUrlService) {}

  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  @ApiBearerAuth()
  @Delete('/:shortCode')
  @ApiOperation({
    summary: 'Delete a shortened URL',
    description: 'Deletes a shortened URL by its short code. Only authenticated users can delete URLs they own.',
  })
  @ApiParam({
    name: 'shortCode',
    required: true,
    description: 'The short code of the URL to delete',
    type: String,
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'URL deleted successfully',
    type: DeleteUrlResponseSwagger,
  })
  @ApiResponse({ status: 400, description: 'Invalid short code format', type: ValidationErrorResponse })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
  @ApiResponse({ status: 403, description: 'Forbidden - User does not own this URL' })
  @ApiResponse({ status: 404, description: 'URL not found', type: NotFoundErrorResponse })
  async deleteUrl(@Req() req: Request, @Param('shortCode') shortCode: string, @Res() res: Response) {
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    const checkBody = DeleteUrlSchema.safeParse({ shortCode });
    if (!checkBody.success) {
      const errorMessage = checkBody.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new InvalidShortCodeError(errorMessage);
    }
    const url = await this.deleteUrlService.execute({ shortCode: checkBody.data.shortCode, userId });
    res.status(200).json({
      message: 'URL deleted successfully',
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
    });
  }
}
