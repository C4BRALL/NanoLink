import { Injectable } from '@nestjs/common';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { CreateUrlRepositoryInterface } from 'src/core/domain/repositories/create-url-repository.interface';
import { UrlMapper } from '../../mappers/url.mapper';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlModel } from '../../models/url.model';
import { DatabaseErrorHandler } from '../../utils/db-error-handler';

@Injectable()
export class CreateUrlRepositoryService implements CreateUrlRepositoryInterface {
  constructor(
    @InjectRepository(UrlModel)
    private readonly urlRepository: Repository<UrlModel>,
    private readonly errorHandler: DatabaseErrorHandler,
  ) {}
  async save(data: UrlEntity): Promise<UrlEntity> {
    try {
      const urlModel = UrlMapper.toPersistence(data);
      const url = await this.urlRepository.save(urlModel);
      return UrlMapper.toDomain(url);
    } catch (error) {
      throw this.errorHandler.handleError(error, 'URL');
    }
  }
}
