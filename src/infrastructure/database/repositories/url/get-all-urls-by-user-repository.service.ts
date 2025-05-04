import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UrlMapper } from '../../mappers/url.mapper';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlModel } from '../../models/url.model';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';
import { GetAllUrlsByUserRepositoryInterface } from 'src/core/domain/repositories/url/get-all-urls-by-user-repository.interface';

@Injectable()
export class GetAllUrlsByUserRepositoryService implements GetAllUrlsByUserRepositoryInterface {
  constructor(
    @InjectRepository(UrlModel)
    private readonly urlRepository: Repository<UrlModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}
  async findAll(userId: string): Promise<UrlEntity[]> {
    try {
      const urls = await this.urlRepository.find({ where: { userId } });
      return urls.map((url) => UrlMapper.toDomain(url));
    } catch (error) {
      throw this.errorHandler.handleError(error, 'URL');
    }
  }
}
