import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUrlService } from 'src/core/use-cases/url/create-url.service';
import { CreateUrlDto, CreateUrlSchema } from 'src/interface/dtos/url/create-url.dto';

@Controller('url')
export class CreateUrlController {
  constructor(private readonly createUrlService: CreateUrlService) {}

  @Post('/create')
  async createUrl(@Body() body: CreateUrlDto) {
    const result = CreateUrlSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException(result.error.message);
    }

    const url = await this.createUrlService.execute({
      originalUrl: body.originalUrl,
      userId: body.userId,
    });

    return url;
  }
}
