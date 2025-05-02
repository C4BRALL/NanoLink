import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { Repository } from 'typeorm';
import { UrlModel } from 'src/infrastructure/database/models/url.model';
import { UrlMapper } from 'src/infrastructure/database/mappers/url.mapper';

export async function configureDbDriverMock(initialData = [{ data: [{}] }]) {
  const seedDb = () => {
    const dbData: any[] = [];
    initialData.forEach(({ data }) => {
      data.forEach((item) => {
        const urlEntity = new UrlEntity({
          id: ((item as any).id as string) || 'e1303f47-863a-4f6d-8d52-01e4db678751',
          shortCode: ((item as any).shortCode as string) || 'def123',
          originalUrl: ((item as any).originalUrl as string) || 'http://example.com',
          userId: ((item as any).userId as string) || undefined,
          createdAt: new Date((item as any).createdAt) || new Date(),
          updatedAt: new Date((item as any).updatedAt) || new Date(),
        });
        if (urlEntity && urlEntity.id) {
          dbData.push(UrlMapper.toPersistence(urlEntity));
        }
      });
    });
    return dbData;
  };

  const mockRepository = {
    save: jest.fn((data: UrlEntity) => {
      const _dbData = seedDb();
      const url = new UrlEntity(data);
      const urlModel = UrlMapper.toPersistence(url);
      _dbData.push(urlModel);
      return Promise.resolve(urlModel);
    }),
    find: jest.fn(() => Promise.resolve(seedDb())),
    findOne: jest.fn(({ where: { shortCode } }) => {
      const data = seedDb();
      return Promise.resolve(
        data.find((item) => {
          return item.shortCode === shortCode;
        }),
      );
    }),
    delete: jest.fn(),
    update: jest.fn(),
  } as unknown as Repository<UrlModel>;

  const spies = {
    Entity: jest.fn(),
    PrimaryGeneratedColumn: jest.fn(),
    Column: jest.fn(),
    CreateDateColumn: jest.fn(),
    UpdateDateColumn: jest.fn(),
    ManyToOne: jest.fn(),
    JoinColumn: jest.fn(),
    OneToMany: jest.fn(),
    Repository: mockRepository,
    getRepository: jest.fn(),
  };

  jest.mock(
    'src/infrastructure/database/models/url.model',
    () => ({
      UrlModel: class UrlModel {},
    }),
    { virtual: true },
  );

  jest.mock(
    'src/infrastructure/database/models/user.model',
    () => ({
      UserModel: class UserModel {},
    }),
    { virtual: true },
  );

  return spies;
}
