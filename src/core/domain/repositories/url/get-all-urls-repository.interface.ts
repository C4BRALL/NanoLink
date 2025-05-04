import { UrlEntity } from '../../entities/url.entity';

export interface GetAllUrlsRepositoryInterface {
  findAll(): Promise<UrlEntity[]>;
}
