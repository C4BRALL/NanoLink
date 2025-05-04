import { UrlEntity } from '../../entities/url.entity';

export interface GetAllUrlsByUserRepositoryInterface {
  findAll(userId: string): Promise<UrlEntity[]>;
}
