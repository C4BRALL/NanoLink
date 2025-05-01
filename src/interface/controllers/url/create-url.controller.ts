import { Body, Controller, Post } from '@nestjs/common';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { CreateUrlService } from 'src/core/use-cases/url/create-url.service';
import { CreateUrlDto, CreateUrlSchema } from 'src/interface/dtos/url/create-url.dto';

@Controller('url')
export class CreateUrlController {
  constructor(private readonly createUrlService: CreateUrlService) {}

  @Post('/create')
  async createUrl(@Body() body: CreateUrlDto) {
    const result = CreateUrlSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');

      throw new InvalidUserDataError(errorMessage);
    }

    const url = await this.createUrlService.execute({
      originalUrl: body.originalUrl,
      userId: body.userId,
    });

    return url;
  }
}
