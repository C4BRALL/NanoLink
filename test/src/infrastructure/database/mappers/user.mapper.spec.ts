import { UserEntity } from 'src/core/domain/entities/user.entity';
import { UserMapper } from 'src/infrastructure/database/mappers/user.mapper';
import { UserModel } from 'src/infrastructure/database/models/user.model';

describe('UserMapper', () => {
  describe('toDomain', () => {
    it('deve converter corretamente um UserModel para UserEntity', () => {
      const mockModel = new UserModel();
      mockModel.name = 'João Silva';
      mockModel.email = 'joao@exemplo.com';
      mockModel.password = 'senha_hash';
      mockModel.createdAt = new Date();
      mockModel.updatedAt = new Date();

      const result = UserMapper.toDomain(mockModel);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.name).toBe(mockModel.name);
      expect(result.email).toBe(mockModel.email);
    });
  });

  describe('toPersistence', () => {
    it('deve converter corretamente um UserEntity para UserModel', () => {
      const mockEntity = new UserEntity({
        name: 'João Silva',
        email: 'joao@exemplo.com',
        password: 'senha_hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = UserMapper.toPersistence(mockEntity);

      expect(result).toBeInstanceOf(UserModel);
      expect(result.name).toBe(mockEntity.name);
      expect(result.email).toBe(mockEntity.email);
    });
  });
});
