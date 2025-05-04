import { Inject, Injectable } from '@nestjs/common';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/url/get-url-by-shortcode-repository.interface';
import { UpdateUrlOriginalUrlRepositoryInterface } from 'src/core/domain/repositories/url/update-url-originalurl-repository.interface';
import { UpdateUrlOriginalUrlInterface } from 'src/core/domain/use-cases/url/update-url-originalurl.interface';
import { UrlAccessDeniedError, UrlUpdateFailedError } from '../errors/url-error';

@Injectable()
export class UpdateUrlOriginalUrlService implements UpdateUrlOriginalUrlInterface {
  constructor(
    @Inject('GetUrlByShortCodeRepositoryInterface')
    private readonly urlRepository: GetUrlByShortCodeRepositoryInterface,
    @Inject('UpdateUrlOriginalUrlRepositoryInterface')
    private readonly updateUrlOriginalUrlRepository: UpdateUrlOriginalUrlRepositoryInterface,
  ) {}
  async execute(params: UpdateUrlOriginalUrlInterface.Params): Promise<UrlEntity> {
    try {
      const url = await this.urlRepository.findByShortCode(params.shortCode);
      
      if (!url.userId) {
        throw new UrlAccessDeniedError(params.shortCode, params.userId);
      }

      if (url.userId !== params.userId) {
        throw new UrlAccessDeniedError(params.shortCode, params.userId);
      }
      
      url.update(params.originalUrl);
      await this.updateUrlOriginalUrlRepository.update(url);
      return url;
    } catch (error) {
      if (error instanceof UrlAccessDeniedError) {
        throw error;
      }
      throw new UrlUpdateFailedError(params.shortCode, error);
    }
  }
}
