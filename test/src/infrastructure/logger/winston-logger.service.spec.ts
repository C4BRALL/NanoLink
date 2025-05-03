import { Test, TestingModule } from '@nestjs/testing';
import { WinstonLoggerService } from 'src/infrastructure/logger/winston-logger.service';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { LoggerHelper } from 'src/core/domain/helpers/logger.helper';
import * as winston from 'winston';
import { Logtail } from '@logtail/node';

jest.mock('@logtail/node');
jest.mock('@logtail/winston');
jest.mock('winston', () => {
  const mockLogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  return {
    format: {
      timestamp: jest.fn().mockReturnValue({}),
      colorize: jest.fn().mockReturnValue({}),
      printf: jest.fn().mockReturnValue({}),
      json: jest.fn().mockReturnValue({}),
      combine: jest.fn().mockReturnValue({}),
    },
    transports: {
      Console: jest.fn(),
    },
    createLogger: jest.fn().mockReturnValue(mockLogger),
  };
});

describe('WinstonLoggerService', () => {
  let service: WinstonLoggerService;
  let configService: EnvironmentConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string | null> = {
        NODE_ENV: 'test',
        LOGTAIL_TOKEN: null,
        LOGTAIL_ENDPOINT: null,
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(LoggerHelper, 'setLogger').mockImplementation();
    jest.spyOn(LoggerHelper, 'info').mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WinstonLoggerService,
        {
          provide: EnvironmentConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<WinstonLoggerService>(WinstonLoggerService);
    configService = module.get<EnvironmentConfigService>(EnvironmentConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve inicializar o logger sem Logtail quando o token não é fornecido', () => {
    expect(winston.createLogger).toHaveBeenCalled();
    expect(winston.transports.Console).toHaveBeenCalled();
  });

  it('deve inicializar o logger com Logtail quando o token é fornecido', () => {
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation((key: string) => {
      const config: Record<string, string> = {
        NODE_ENV: 'test',
        LOGTAIL_TOKEN: 'token-teste',
        LOGTAIL_ENDPOINT: 'https://logtail.com',
      };
      return config[key];
    });

    service = new WinstonLoggerService(configService);

    expect(winston.createLogger).toHaveBeenCalled();
    expect(winston.transports.Console).toHaveBeenCalled();
  });

  it('deve configurar o LoggerHelper no onModuleInit', () => {
    service.onModuleInit();
    expect(LoggerHelper.setLogger).toHaveBeenCalledWith(service);
    expect(LoggerHelper.info).toHaveBeenCalledWith('Logger initialized', 'WinstonLoggerService');
  });

  describe('métodos de logging', () => {
    let loggerMock: {
      debug: jest.Mock;
      info: jest.Mock;
      warn: jest.Mock;
      error: jest.Mock;
    };

    beforeEach(() => {
      loggerMock = (winston.createLogger as jest.Mock).mock.results[0].value;
      jest.spyOn(service, 'flush').mockImplementation(() => Promise.resolve());
    });

    it('deve chamar logger.debug com os parâmetros corretos', () => {
      service.debug('mensagem de teste', 'contexto-teste', { meta: 'teste' });
      expect(loggerMock.debug).toHaveBeenCalledWith('mensagem de teste', {
        context: 'contexto-teste',
        meta: 'teste',
      });
      expect(service.flush).toHaveBeenCalled();
    });

    it('deve chamar logger.info com os parâmetros corretos', () => {
      service.info('mensagem de teste', 'contexto-teste', { meta: 'teste' });
      expect(loggerMock.info).toHaveBeenCalledWith('mensagem de teste', {
        context: 'contexto-teste',
        meta: 'teste',
      });
      expect(service.flush).toHaveBeenCalled();
    });

    it('deve chamar logger.warn com os parâmetros corretos', () => {
      service.warn('mensagem de teste', 'contexto-teste', { meta: 'teste' });
      expect(loggerMock.warn).toHaveBeenCalledWith('mensagem de teste', {
        context: 'contexto-teste',
        meta: 'teste',
      });
      expect(service.flush).toHaveBeenCalled();
    });

    it('deve chamar logger.error com os parâmetros corretos', () => {
      const erro = new Error('erro de teste');
      service.error('mensagem de teste', 'contexto-teste', erro, { meta: 'teste' });
      expect(loggerMock.error).toHaveBeenCalledWith('mensagem de teste', {
        context: 'contexto-teste',
        error: {
          message: erro.message,
          stack: erro.stack,
          name: erro.name,
        },
        meta: 'teste',
      });
      expect(service.flush).toHaveBeenCalled();
    });

    it('deve chamar logger.error sem o objeto de erro quando não é fornecido', () => {
      service.error('mensagem de teste', 'contexto-teste', undefined, { meta: 'teste' });
      expect(loggerMock.error).toHaveBeenCalledWith('mensagem de teste', {
        context: 'contexto-teste',
        error: undefined,
        meta: 'teste',
      });
      expect(service.flush).toHaveBeenCalled();
    });
  });

  describe('método flush', () => {
    it('deve retornar Promise.resolve quando não há logtail', async () => {
      const result = await service.flush();
      expect(result).toBeUndefined();
    });

    it('deve chamar logtail.flush quando logtail está disponível', async () => {
      jest.clearAllMocks();
      mockConfigService.get.mockImplementation((key: string) => {
        const config: Record<string, string> = {
          NODE_ENV: 'test',
          LOGTAIL_TOKEN: 'token-teste',
          LOGTAIL_ENDPOINT: 'https://logtail.com',
        };
        return config[key];
      });

      const logtailMock = {
        flush: jest.fn().mockResolvedValue(undefined),
      };

      service['logtail'] = logtailMock as unknown as Logtail;

      await service.flush();
      expect(logtailMock.flush).toHaveBeenCalled();
    });
  });
});
