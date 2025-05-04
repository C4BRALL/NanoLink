import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UrlMapper } from '../../mappers/url.mapper';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlModel } from '../../models/url.model';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';
import { GetUrlByShortCodeRepositoryInterface } from 'src/core/domain/repositories/url/get-url-by-shortcode-repository.interface';

@Injectable()
export class GetUrlByShortCodeRepositoryService implements GetUrlByShortCodeRepositoryInterface {
  constructor(
    @InjectRepository(UrlModel)
    private readonly urlRepository: Repository<UrlModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}
  async findByShortCode(shortCode: string): Promise<UrlEntity> {
    try {
      const url = await this.urlRepository.findOne({ where: { shortCode, deletedAt: IsNull() } });
      if (!url) {
        throw new NotFoundException(`URL with short code '${shortCode}' not found`);
      }
      return UrlMapper.toDomain(url);
    } catch (error) {
      throw this.errorHandler.handleError(error, 'URL');
    }
  }
}
