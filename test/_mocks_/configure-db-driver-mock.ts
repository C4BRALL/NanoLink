import { Repository } from 'typeorm';
import { UrlEntity } from 'src/core/domain/entities/url.entity';
import { UrlMapper } from 'src/infrastructure/database/mappers/url.mapper';
import { UserEntity } from 'src/core/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/database/mappers/user.mapper';

/**
 * Configura um repositório mock para testes de entidade de URL ou User.
 * @param initialData Array de objetos iniciais no formato [{ data: [...] }]
 * @param entityType Tipo de entidade: 'url' ou 'user'. Default 'url'.
 */
export async function configureDbDriverMock(initialData: Array<{ data: any[] }> = [{ data: [{}] }], entityType: 'url' | 'user' = 'url') {
  const seedDb = () => {
    const dbData: any[] = [];
    initialData.forEach(({ data }) => {
      data.forEach((item) => {
        if (entityType === 'url') {
          const urlEntity = new UrlEntity({
            id: (item as any).id || 'e1303f47-863a-4f6d-8d52-01e4db678751',
            shortCode: (item as any).shortCode || 'def123',
            originalUrl: (item as any).originalUrl || 'http://example.com',
            clickCount: (item as any).clickCount || 0,
            userId: (item as any).userId,
            createdAt: new Date((item as any).createdAt) || new Date(),
            updatedAt: new Date((item as any).updatedAt) || new Date(),
          });
          dbData.push(UrlMapper.toPersistence(urlEntity));
        } else {
          const userEntity = new UserEntity({
            id: (item as any).id,
            name: (item as any).name,
            email: (item as any).email,
            password: (item as any).password,
            createdAt: new Date((item as any).createdAt) || new Date(),
            updatedAt: new Date((item as any).updatedAt) || new Date(),
            deletedAt: (item as any).deletedAt ? new Date((item as any).deletedAt) : undefined,
          });
          dbData.push(UserMapper.toPersistence(userEntity));
        }
      });
    });
    return dbData;
  };

  const mockRepository = {
    save: jest.fn((data: any) => {
      const _dbData = seedDb();
      const entity = entityType === 'url' ? new UrlEntity(data) : new UserEntity(data);
      const model = entityType === 'url' ? UrlMapper.toPersistence(entity as UrlEntity) : UserMapper.toPersistence(entity as UserEntity);
      _dbData.push(model);
      return Promise.resolve(model);
    }),
    find: jest.fn((options: any) => {
      const data = seedDb();
      if (entityType === 'url') {
        return Promise.resolve(data.filter((item) => item.userId === options.where.userId));
      } else {
        return Promise.resolve(data);
      }
    }),
    findOne: jest.fn((options: any) => {
      const data = seedDb();
      if (entityType === 'url') {
        const { shortCode } = options.where;
        return Promise.resolve(data.find((item) => item.shortCode === shortCode));
      } else {
        const { email } = options.where;
        return Promise.resolve(data.find((item) => item.email === email));
      }
    }),
    delete: jest.fn(),
    update: jest.fn((criteria: any, partialEntity: any) => {
      const data = seedDb();
      const record = data.find((item) => item.id === criteria);
      if (record) {
        Object.assign(record, partialEntity);
      }
      const result = { raw: [record], affected: 1 };
      return Promise.resolve(result);
    }),
  } as unknown as Repository<any>;

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

  jest.mock('src/infrastructure/database/models/url.model', () => ({ UrlModel: class UrlModel {} }), { virtual: true });

  jest.mock('src/infrastructure/database/models/user.model', () => ({ UserModel: class UserModel {} }), { virtual: true });

  return spies;
}
