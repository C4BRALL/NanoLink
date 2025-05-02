import { Inject, Injectable } from '@nestjs/common';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/get-url-by-shortcode-repository.interface';
import { GetUrlByShortCodeInterface } from 'src/core/domain/use-cases/get-url-by-shortcode.interface';
import { UrlRetrievalFailedError } from '../errors/url-error';

@Injectable()
export class GetUrlByShortCodeService implements GetUrlByShortCodeInterface {
  constructor(
    @Inject('GetUrlByShortCodeRepositoryInterface')
    private readonly urlRepository: GetUrlByShortCodeRepositoryInterface,
  ) {}
  async execute(params: GetUrlByShortCodeInterface.Params): Promise<GetUrlByShortCodeInterface.Output> {
    try {
      const url = await this.urlRepository.findByShortCode(params.shortCode);
      if (!url?.id || url.isDeleted() === true) {
        return { url: null };
      }
      return { url };
    } catch (error) {
      throw new UrlRetrievalFailedError(params.shortCode, error);
    }
  }
}
