import { Body, Controller, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { InvalidShortCodeError } from 'src/core/errors/url-error';
import { UpdateUrlOriginalUrlService } from 'src/core/use-cases/url/update-url-originalurl.service';
import { UpdateUrlOriginalUrlDto, UpdateUrlOriginalUrlSchema } from 'src/interface/dtos/url/update-url-originalurl.dto';
import { AuthGuard } from 'src/interface/guards/auth.guard';

@ApiTags('URLs')
@Controller('url')
export class UpdateUrlOriginalUrlController {
  constructor(private readonly updateUrlOriginalUrlService: UpdateUrlOriginalUrlService) {}

  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  @ApiBearerAuth()
  @Put('/:shortCode')
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
