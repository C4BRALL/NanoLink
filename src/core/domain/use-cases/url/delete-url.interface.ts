import { UrlEntity } from '../../entities/url.entity';

export interface DeleteUrlInterface {
  execute(params: DeleteUrlInterface.Params): Promise<UrlEntity>;
}

export namespace DeleteUrlInterface {
  export type Params = {
    shortCode: string;
  };
}
