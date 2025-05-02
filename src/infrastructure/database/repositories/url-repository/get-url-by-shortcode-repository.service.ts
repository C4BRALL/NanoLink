import { Injectable } from '@nestjs/common';
import { UrlMapper } from '../../mappers/url.mapper';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlModel } from '../../models/url.model';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/get-url-by-shortcode-repository.interface';

@Injectable()
export class GetUrlByShortCodeRepositoryService implements GetUrlByShortCodeRepositoryInterface {
  constructor(
    @InjectRepository(UrlModel)
    private readonly urlRepository: Repository<UrlModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}
  async findByShortCode(shortCode: string): Promise<UrlEntity> {
    try {
      const url = await this.urlRepository.findOne({ where: { shortCode } });
      if (!url) {
        throw new EntityNotFoundError('URL', shortCode);
      }
      return UrlMapper.toDomain(url);
    } catch (error) {
      throw this.errorHandler.handleError(error, 'URL');
    }
  }
}
