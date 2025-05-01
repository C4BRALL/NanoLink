import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { CreateUrlRepositoryInterface } from 'src/core/domain/repositories/create-url-repository.interface';
import { CreateUrlRepositoryService } from 'src/infrastructure/database/repositories/url-repository/create-url-repository.service';
import { configureDbDriverMockt } from '../../../../../_mocks_/configure-db-driver-mockt';

jest.mock('src/infrastructure/database/mappers/url.mapper', () => ({
  UrlMapper: {
    toPersistence: jest.fn((entity) => ({
      id: entity.id || '123',
      shortCode: entity.shortCode,
      originalUrl: entity.originalUrl,
    })),
    toDomain: jest.fn(
      (model) =>
        new UrlEntity({
          id: model.id,
          shortCode: model.shortCode,
          originalUrl: model.originalUrl,
        }),
    ),
  },
}));

import { UrlMapper } from 'src/infrastructure/database/mappers/url.mapper';

describe('CreateUrlRepositoryService', () => {
  const expectedCreatedAt = Date.now();
  let createUrlRepository: CreateUrlRepositoryInterface;
  let mockRepository: any;

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(expectedCreatedAt);

    const initialData = {
      originalUrl: 'https://www.google.com',
      shortCode: '123456',
      userId: '123456',
      createdAt: expectedCreatedAt,
      updatedAt: expectedCreatedAt,
    };

    const seedDB = [
      {
        data: [initialData],
      },
    ];

    const spies = await configureDbDriverMockt(seedDB);
    mockRepository = spies.Repository;

    createUrlRepository = new CreateUrlRepositoryService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save a url', async () => {
    const url = new UrlEntity({
      originalUrl: 'https://www.google.com',
      shortCode: '123456',
    });

    await createUrlRepository.save(url);

    expect(mockRepository.save).toHaveBeenCalled();
    expect(UrlMapper.toPersistence).toHaveBeenCalledWith(url);
    expect(UrlMapper.toDomain).toHaveBeenCalled();
  });
});
