import { UrlEntity } from '../../entities/url.entity';

export interface GetAllUrlsInterface {
  execute(): Promise<UrlEntity[]>;
}
