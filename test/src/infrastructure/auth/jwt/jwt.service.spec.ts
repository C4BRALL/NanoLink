import { Test, TestingModule } from '@nestjs/testing';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService } from 'src/infrastructure/auth/jwt/jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let nestJwtService: NestJwtService;
  const signMock = jest.fn();
  const verifyMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestJwtService,
          useValue: { sign: signMock, verify: verifyMock },
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
    nestJwtService = module.get<NestJwtService>(NestJwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should sign payload and return token', () => {
    const payload = { sub: '123', role: 'admin' };
    signMock.mockReturnValue('mytoken');

    const token = service.sign(payload);

    expect(signMock).toHaveBeenCalledWith(payload);
    expect(token).toBe('mytoken');
  });

  it('should verify token and return payload', () => {
    const expectedPayload = { sub: '123', role: 'user' };
    verifyMock.mockReturnValue(expectedPayload);

    const result = service.verify('mytoken');

    expect(verifyMock).toHaveBeenCalledWith('mytoken');
    expect(result).toEqual(expectedPayload);
  });
});
