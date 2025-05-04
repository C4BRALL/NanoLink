import { UrlEntity } from '../../entities/url.entity';

export interface UpdateUrlOriginalUrlInterface {
  execute(params: UpdateUrlOriginalUrlInterface.Params): Promise<UrlEntity>;
}

export namespace UpdateUrlOriginalUrlInterface {
  export type Params = {
    shortCode: string;
    originalUrl: string;
    userId: string;
  };
}
