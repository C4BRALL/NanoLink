import { Inject, Injectable } from '@nestjs/common';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { CreateUrlInterface } from 'src/core/domain/use-cases/create-url.interface';
import { nanoid } from 'nanoid';
import { CreateUrlRepositoryInterface } from 'src/core/domain/repositories/create-url-repository.interface';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { UrlCreationFailedError } from '../errors/url-error';

@Injectable()
export class CreateUrlService implements CreateUrlInterface {
  constructor(
    @Inject('CreateUrlRepositoryInterface')
    private readonly urlRepository: CreateUrlRepositoryInterface,
    private readonly environmentConfig: EnvironmentConfigService,
  ) {}
  async execute(params: CreateUrlInterface.Params): Promise<CreateUrlInterface.Output> {
    try {
      const url = new UrlEntity({
        originalUrl: params.originalUrl,
        shortCode: nanoid(6),
        userId: params.userId,
      });

      await this.urlRepository.save(url);

      return { url, link: `${this.environmentConfig.get('API_DOMAIN') || 'http://localhost:3000'}/${url.shortCode}` };
    } catch (error) {
      if (error instanceof Error) {
        throw new UrlCreationFailedError(params.originalUrl, error);
      }
      throw error;
    }
  }
}
