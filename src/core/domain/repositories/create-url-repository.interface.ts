import { UrlEntity } from '../entities/url.entity';

export interface CreateUrlRepositoryInterface {
  save(data: UrlEntity): Promise<UrlEntity>;
}
