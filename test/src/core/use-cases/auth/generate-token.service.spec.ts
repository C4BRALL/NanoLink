import { GenerateTokenService } from 'src/core/use-cases/auth/generate-token.service';
import { JwtInterface } from 'src/core/domain/auth/jwt.interface';

describe('GenerateTokenService', () => {
  let service: GenerateTokenService;
  let jwtMock: jest.Mocked<JwtInterface>;

  beforeEach(() => {
    jwtMock = {
      sign: jest.fn<string, [object]>(),
      verify: jest.fn(),
    };
    service = new GenerateTokenService(jwtMock);
  });

  it('should generate token with only userId', async () => {
    jwtMock.sign.mockReturnValue('signed-token');

    const token = await service.execute('user-123');

    expect(jwtMock.sign).toHaveBeenCalledWith({ sub: 'user-123' });
    expect(token).toBe('signed-token');
  });

  it('should generate token including extra payload', async () => {
    jwtMock.sign.mockReturnValue('signed-token-2');

    const extra = { role: 'admin', foo: 'bar' };
    const token = await service.execute('user-456', extra);

    expect(jwtMock.sign).toHaveBeenCalledWith({ sub: 'user-456', ...extra });
    expect(token).toBe('signed-token-2');
  });

  it('should propagate errors from sign', async () => {
    jwtMock.sign.mockImplementation(() => {
      throw new Error('fail');
    });

    await expect(service.execute('user-789')).rejects.toThrow('fail');
  });
});
