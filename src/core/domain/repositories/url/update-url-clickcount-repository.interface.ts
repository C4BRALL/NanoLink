import { UrlEntity } from '../../entities/url.entity';

export interface UpdateUrlClickCountRepositoryInterface {
  update(data: UrlEntity): Promise<UrlEntity>;
}
