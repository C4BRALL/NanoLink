import { Inject, Injectable } from '@nestjs/common';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { CreateUrlInterface } from 'src/core/domain/use-cases/create-url.interface';
import { nanoid } from 'nanoid';
import { CreateUrlRepositoryInterface } from 'src/core/domain/repositories/create-url-repository.interface';

@Injectable()
export class CreateUrlService implements CreateUrlInterface {
  constructor(
    @Inject('CreateUrlRepositoryInterface')
    private readonly urlRepository: CreateUrlRepositoryInterface,
  ) {}
  async execute(params: CreateUrlInterface.Params): Promise<CreateUrlInterface.Output> {
    const url = new UrlEntity({
      originalUrl: params.originalUrl,
      shortCode: nanoid(6),
      userId: params.userId,
    });

    await this.urlRepository.save(url);

    return { url };
  }
}
