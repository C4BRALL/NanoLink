import { UrlEntity } from '../entities/url.entity';

export interface CreateUrlInterface {
  execute(url: CreateUrlInterface.Params): Promise<CreateUrlInterface.Output>;
}

export namespace CreateUrlInterface {
  export type Params = {
    originalUrl: string;
    userId?: string;
  };

  export type Output = {
    url: UrlEntity;
    link: string;
  };
}
