import { UrlEntity } from '../entities/url.entity';

export interface GetUrlByShortCodeInterface {
  execute(url: GetUrlByShortCodeInterface.Params): Promise<GetUrlByShortCodeInterface.Output>;
}

export namespace GetUrlByShortCodeInterface {
  export type Params = {
    shortCode: string;
  };

  export type Output = {
    url: UrlEntity;
  };
}
