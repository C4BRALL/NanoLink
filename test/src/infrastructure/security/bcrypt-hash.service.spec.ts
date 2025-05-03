import * as bcrypt from 'bcrypt';
// Removido mock de módulo; usaremos spyOn diretamente em bcrypt.hash
import { BcryptHashService } from 'src/infrastructure/security/bcrypt-hash.service';

describe('BcryptHashService', () => {
  let service: BcryptHashService;

  beforeEach(() => {
    service = new BcryptHashService();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.BCRYPT_SALT_ROUNDS;
  });

  it('should hash with default rounds when env var not set', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock;

    hashSpy.mockResolvedValue('hashed');
    const result = await service.hash('myPassword');

    expect(hashSpy).toHaveBeenCalledWith('myPassword', 6);
    expect(result).toBe('hashed');
  });

  it('should hash with env var rounds when set', async () => {
    process.env.BCRYPT_SALT_ROUNDS = '10';

    const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock;

    hashSpy.mockResolvedValue('hashed10');

    const result = await service.hash('pass');

    expect(hashSpy).toHaveBeenCalledWith('pass', 10);
    expect(result).toBe('hashed10');
  });

  it('should throw if bcrypt.hash rejects', async () => {
    process.env.BCRYPT_SALT_ROUNDS = '8';

    const hashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock;

    hashSpy.mockRejectedValue(new Error('fail'));

    await expect(service.hash('pw')).rejects.toThrow('fail');
  });
});
