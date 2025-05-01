import { Inject, Injectable } from '@nestjs/common';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { CreateUrlRepositoryInterface } from 'src/core/domain/repositories/create-url-repository.interface';
import { UrlMapper } from '../../mappers/url.mapper';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UrlModel } from '../../models/url.model';

@Injectable()
export class CreateUrlRepositoryService implements CreateUrlRepositoryInterface {
  constructor(
    @InjectRepository(UrlModel)
    private readonly urlRepository: Repository<UrlModel>,
  ) {}
  async save(data: UrlEntity): Promise<UrlEntity> {
    const urlModel = UrlMapper.toPersistence(data);
    const url = await this.urlRepository.save(urlModel);
    return UrlMapper.toDomain(url);
  }
}
