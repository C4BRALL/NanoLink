import { UrlEntity } from '../../entities/url.entity';

export interface DeleteUrlRepositoryInterface {
  delete(data: UrlEntity): Promise<UrlEntity>;
}
