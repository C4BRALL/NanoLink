import { Controller, Delete, Inject, Param, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InvalidShortCodeError } from 'src/core/errors/url-error';
import { DeleteUrlService } from 'src/core/use-cases/url/delete-url.service';
import { DeleteUrlSchema } from 'src/interface/dtos/url/delete-url.dto';
import { AuthGuard } from 'src/interface/guards/auth.guard';

@ApiTags('URLs')
@Controller('url')
export class DeleteUrlController {
  constructor(private readonly deleteUrlService: DeleteUrlService) {}

  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  @ApiBearerAuth()
  @Delete('/:shortCode')
  async deleteUrl(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const checkBody = DeleteUrlSchema.safeParse({ shortCode });
    if (!checkBody.success) {
      const errorMessage = checkBody.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new InvalidShortCodeError(errorMessage);
    }
    const url = await this.deleteUrlService.execute({ shortCode });
    res.status(200).json({
      message: 'URL deleted successfully',
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
    });
  }
}
