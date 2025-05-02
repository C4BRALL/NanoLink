import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { GetUrlByShortCodeService } from 'src/core/use-cases/url/get-url-by-shortcode.service';
import { Response } from 'express';

@Controller()
export class ShortUrlController {
  constructor(private readonly getUrlByShortCodeService: GetUrlByShortCodeService) {}

  @Get(':shortCode')
  async urlShortCode(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const result = await this.getUrlByShortCodeService.execute({ shortCode });

    if (result && result.originalUrl) {
      return res.redirect(result.originalUrl);
    } else {
      throw new NotFoundException(`URL with short code '${shortCode}' not found`);
    }
  }
}
