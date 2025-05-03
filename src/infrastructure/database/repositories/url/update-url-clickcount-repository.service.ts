import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UrlModel } from '../../models/url.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UpdateUrlClickCountRepositoryInterface } from 'src/core/domain/repositories/url/update-url-clickcount-repository.interface';

@Injectable()
export class UpdateUrlClickCountRepositoryService implements UpdateUrlClickCountRepositoryInterface {
  constructor(
    @InjectRepository(UrlModel)
    private readonly urlRepository: Repository<UrlModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}

  async update(data: UrlEntity): Promise<UrlEntity> {
    try {
      if (data.isDeleted()) {
        throw this.errorHandler.handleError(new NotFoundException(`URL with shortCode '${data.shortCode}' not found`), 'URL');
      }

      const result = await this.urlRepository.update(data.id, {
        clickCount: data.clickCount,
        lastClickDate: data.lastClickDate,
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
