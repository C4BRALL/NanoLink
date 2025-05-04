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

  it('Should initialize the logger without Logtail when the token is not provided', () => {
    expect(winston.createLogger).toHaveBeenCalled();
    expect(winston.transports.Console).toHaveBeenCalled();
  });

  it('Should initialize the logger with Logtail when the token is provided', () => {
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation((key: string) => {
      const config: Record<string, string> = {
        NODE_ENV: 'test',
        LOGTAIL_TOKEN: 'token-test',
        LOGTAIL_ENDPOINT: 'https://logtail.com',
      };
      return config[key];
    });

    service = new WinstonLoggerService(configService);

    expect(winston.createLogger).toHaveBeenCalled();
    expect(winston.transports.Console).toHaveBeenCalled();
  });

  it('Should configure the LoggerHelper in onModuleInit', () => {
    service.onModuleInit();
    expect(LoggerHelper.setLogger).toHaveBeenCalledWith(service);
    expect(LoggerHelper.info).toHaveBeenCalledWith('Logger initialized', 'WinstonLoggerService');
  });

  describe('Logging methods', () => {
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

    it('Should call logger.debug with the correct parameters', () => {
      service.debug('test message', 'context', { meta: 'test' });
      expect(loggerMock.debug).toHaveBeenCalledWith('test message', {
        context: 'context',
        meta: 'test',
      });
      expect(service.flush).toHaveBeenCalled();
    });

    it('Should call logger.info with the correct parameters', () => {
      service.info('test message', 'context', { meta: 'test' });
      expect(loggerMock.info).toHaveBeenCalledWith('test message', {
        context: 'context',
        meta: 'test',
      });
      expect(service.flush).toHaveBeenCalled();
    });

    it('Should call logger.warn with the correct parameters', () => {
      service.warn('test message', 'context', { meta: 'test' });
      expect(loggerMock.warn).toHaveBeenCalledWith('test message', {
        context: 'context',
        meta: 'test',
      });
      expect(service.flush).toHaveBeenCalled();
    });

    it('Should call logger.error with the correct parameters', () => {
      const erro = new Error('test error');
      service.error('test message', 'context', erro, { meta: 'test' });
      expect(loggerMock.error).toHaveBeenCalledWith('test message', {
        context: 'context',
        error: {
          message: erro.message,
          stack: erro.stack,
          name: erro.name,
        },
        meta: 'test',
      });
      expect(service.flush).toHaveBeenCalled();
    });

    it('Should call logger.error without the error object when it is not provided', () => {
      service.error('test message', 'context', undefined, { meta: 'test' });
      expect(loggerMock.error).toHaveBeenCalledWith('test message', {
        context: 'context',
        error: undefined,
        meta: 'test',
      });
      expect(service.flush).toHaveBeenCalled();
    });
  });

  describe('flush method', () => {
    it('Should return Promise.resolve when there is no logtail', async () => {
      const result = await service.flush();
      expect(result).toBeUndefined();
    });

    it('Should call logtail.flush when logtail is available', async () => {
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
