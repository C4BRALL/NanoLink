import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { Repository } from 'typeorm';
import { UrlModel } from 'src/infrastructure/database/models/url.model';

export async function configureDbDriverMockt(initialData = [{ data: [{}] }]) {
  const seedDb = () => {
    const dbData: any[] = [];
    initialData.forEach(({ data }) => {
      data.forEach((item) => dbData.push(item));
    });
    return dbData;
  };

  const mockRepository = {
    save: jest.fn((data: UrlEntity) => {
      const _dbData = seedDb();
      const url = new UrlEntity(data);
      _dbData.push(url);
      return Promise.resolve(url);
    }),
    find: jest.fn(),
    findOne: jest.fn(),
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
