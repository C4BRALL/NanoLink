import { Inject, Injectable } from '@nestjs/common';
import { UrlRetrievalFailedError } from '../errors/url-error';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { GetAllUrlsByUserInterface } from 'src/core/domain/use-cases/url/get-all-urls-by-user.interface';
import { GetAllUrlsByUserRepositoryInterface } from 'src/core/domain/repositories/url/get-all-urls-by-user-repository.interface';

@Injectable()
export class GetAllUrlsByUserService implements GetAllUrlsByUserInterface {
  constructor(
    @Inject('GetAllUrlsByUserRepositoryInterface')
    private readonly urlRepository: GetAllUrlsByUserRepositoryInterface,
  ) {}
  async execute(userId: string): Promise<UrlEntity[]> {
    try {
      const urls = await this.urlRepository.findAll(userId);

      return urls;
    } catch (error) {
      throw new UrlRetrievalFailedError(userId, error);
    }
  }
}
