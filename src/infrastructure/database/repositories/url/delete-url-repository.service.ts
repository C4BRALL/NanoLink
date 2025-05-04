import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UrlModel } from '../../models/url.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { DeleteUrlRepositoryInterface } from 'src/core/domain/repositories/url/delete-url-repository.interface';

@Injectable()
export class DeleteUrlRepositoryService implements DeleteUrlRepositoryInterface {
  constructor(
    @InjectRepository(UrlModel)
    private readonly urlRepository: Repository<UrlModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}

  async delete(data: UrlEntity): Promise<UrlEntity> {
    try {
      const result = await this.urlRepository.update(data.id, {
        deletedAt: data.deletedAt,
        updatedAt: data.updatedAt,
      });

      if (!result.affected) {
        throw this.errorHandler.handleError(new BadRequestException(`URL with shortCode '${data.shortCode}' not deleted`), 'URL');
      }

      return data;
    } catch (error) {
      throw this.errorHandler.handleError(error, 'URL');
    }
  }
}
