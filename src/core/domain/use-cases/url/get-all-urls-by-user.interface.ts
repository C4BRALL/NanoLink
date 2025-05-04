import { UrlEntity } from '../../entities/url.entity';

export interface GetAllUrlsByUserInterface {
  execute(userId: string): Promise<UrlEntity[]>;
}
