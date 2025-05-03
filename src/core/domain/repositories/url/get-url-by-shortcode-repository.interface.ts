import { UrlEntity } from '../../entities/url.entity';

export interface GetUrlByShortCodeRepositoryInterface {
  findByShortCode(shortCode: string): Promise<UrlEntity>;
}
