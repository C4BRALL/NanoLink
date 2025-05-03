import { Inject, Injectable } from '@nestjs/common';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/url/get-url-by-shortcode-repository.interface';
import { GetUrlByShortCodeInterface } from 'src/core/domain/use-cases/url/get-url-by-shortcode.interface';
import { UrlRetrievalFailedError } from '../errors/url-error';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UpdateUrlClickCountRepositoryInterface } from 'src/core/domain/repositories/url/update-url-clickcount-repository.interface';

@Injectable()
export class GetUrlByShortCodeService implements GetUrlByShortCodeInterface {
  constructor(
    @Inject('GetUrlByShortCodeRepositoryInterface')
    private readonly urlRepository: GetUrlByShortCodeRepositoryInterface,
    @Inject('UpdateUrlClickCountRepositoryInterface')
    private readonly updateUrlRepository: UpdateUrlClickCountRepositoryInterface,
  ) {}
  async execute(params: GetUrlByShortCodeInterface.Params): Promise<UrlEntity> {
    try {
      const url = await this.urlRepository.findByShortCode(params.shortCode);

      url.incrementClickCount();

      await this.updateUrlRepository.update(url);
      return url;
    } catch (error) {
      throw new UrlRetrievalFailedError(params.shortCode, error);
    }
  }
}
