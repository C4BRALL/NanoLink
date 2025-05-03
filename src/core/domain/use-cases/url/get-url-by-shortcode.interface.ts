import { UrlEntity } from '../../entities/url.entity';

export interface GetUrlByShortCodeInterface {
  execute(url: GetUrlByShortCodeInterface.Params): Promise<UrlEntity>;
}

export namespace GetUrlByShortCodeInterface {
  export type Params = {
    shortCode: string;
  };
}
