import { Inject, Injectable } from '@nestjs/common';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { DeleteUrlRepositoryInterface } from 'src/core/domain/repositories/url/delete-url-repository.interface';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/url/get-url-by-shortcode-repository.interface';
import { DeleteUrlInterface } from 'src/core/domain/use-cases/url/delete-url.interface';
import { UrlDeletionFailedError } from '../errors/url-error';

@Injectable()
export class DeleteUrlService implements DeleteUrlInterface {
  constructor(
    @Inject('GetUrlByShortCodeRepositoryInterface')
    private readonly urlRepository: GetUrlByShortCodeRepositoryInterface,
    @Inject('DeleteUrlRepositoryInterface')
    private readonly deleteUrlRepository: DeleteUrlRepositoryInterface,
  ) {}
  async execute(params: { shortCode: string }): Promise<UrlEntity> {
    try {
      const url = await this.urlRepository.findByShortCode(params.shortCode);

      url.softDelete();

      await this.deleteUrlRepository.delete(url);
      return url;
    } catch (error) {
      throw new UrlDeletionFailedError(params.shortCode, error);
    }
  }
}
