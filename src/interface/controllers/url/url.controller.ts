import { Controller, Get } from '@nestjs/common';

@Controller('url')
export class UrlController {
  //   constructor(private readonly urlService: UrlService) {}
  @Get()
  async getUrls() {
    return 'Hello World';
  }
}
