import { UrlEntity } from '../../entities/url.entity';

export interface UpdateUrlOriginalUrlRepositoryInterface {
  update(data: UrlEntity): Promise<UrlEntity>;
}
