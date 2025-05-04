import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UrlModel } from '../../models/url.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UpdateUrlOriginalUrlRepositoryInterface } from 'src/core/domain/repositories/url/update-url-originalurl-repository.interface';

@Injectable()
export class UpdateUrlOriginalUrlRepositoryService implements UpdateUrlOriginalUrlRepositoryInterface {
  constructor(
    @InjectRepository(UrlModel)
    private readonly urlRepository: Repository<UrlModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}

  async update(data: UrlEntity): Promise<UrlEntity> {
    try {
      const result = await this.urlRepository.update(data.id, {
        originalUrl: data.originalUrl,
        updatedAt: data.updatedAt,
      });

      if (!result.affected) {
        throw this.errorHandler.handleError(new BadRequestException(`URL with shortCode '${data.shortCode}' not updated`), 'URL');
      }

      return data;
    } catch (error) {
      throw this.errorHandler.handleError(error, 'URL');
    }
  }
}
