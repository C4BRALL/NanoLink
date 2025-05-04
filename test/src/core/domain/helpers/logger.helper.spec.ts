import { LoggerHelper } from 'src/core/domain/helpers/logger.helper';
import { LoggerInterface } from 'src/core/domain/logger/logger.interface';

describe('LoggerHelper', () => {
  let mockLogger: LoggerInterface;
  let consoleDebugSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // @ts-ignore
    LoggerHelper['logger'] = undefined;

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setLogger', () => {
    it('Should set the logger', () => {
      LoggerHelper.setLogger(mockLogger);

      // @ts-ignore
      expect(LoggerHelper['logger']).toBe(mockLogger);
    });
  });

  describe('quando o logger não está configurado', () => {
    it('Should use console.debug when the debug method is called', () => {
      const message = 'debug message';
      const context = 'context-test';
      const meta = { test: 'meta' };

      LoggerHelper.debug(message, context, meta);

      expect(consoleDebugSpy).toHaveBeenCalledWith(`[DEBUG] [${context}]: ${message}`, meta);
    });

    it('Should use console.info when the info method is called', () => {
      const message = 'info message';
      const context = 'context-test';
      const meta = { test: 'meta' };

      LoggerHelper.info(message, context, meta);

      expect(consoleInfoSpy).toHaveBeenCalledWith(`[INFO] [${context}]: ${message}`, meta);
    });

    it('Should use console.warn when the warn method is called', () => {
      const message = 'warn message';
      const context = 'context-test';
      const meta = { test: 'meta' };

      LoggerHelper.warn(message, context, meta);

      expect(consoleWarnSpy).toHaveBeenCalledWith(`[WARN] [${context}]: ${message}`, meta);
    });

    it('Should use console.error when the error method is called', () => {
      const message = 'error message';
      const context = 'context-test';
      const error = new Error('error test');
      const meta = { test: 'meta' };

      LoggerHelper.error(message, context, error, meta);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `[ERROR] [${context}]: ${message}`,
        { message: error.message, stack: error.stack },
        meta,
      );
    });

    it('Should use "General" as the default context when the context is not provided', () => {
      const message = 'message without context';

      LoggerHelper.debug(message);

      expect(consoleDebugSpy).toHaveBeenCalledWith(`[DEBUG] [General]: ${message}`, undefined);
    });
  });

  describe('when the logger is configured', () => {
    beforeEach(() => {
      LoggerHelper.setLogger(mockLogger);
    });

    it('Should call logger.debug when the debug method is called', () => {
      const message = 'debug message';
      const context = 'context-test';
      const meta = { test: 'meta' };

      LoggerHelper.debug(message, context, meta);

      expect(mockLogger.debug).toHaveBeenCalledWith(message, context, meta);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('Should call logger.info when the info method is called', () => {
      const message = 'info message';
      const context = 'context-test';
      const meta = { test: 'meta' };

      LoggerHelper.info(message, context, meta);

      expect(mockLogger.info).toHaveBeenCalledWith(message, context, meta);
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('Should call logger.warn when the warn method is called', () => {
      const message = 'warn message';
      const context = 'context-test';
      const meta = { test: 'meta' };

      LoggerHelper.warn(message, context, meta);

      expect(mockLogger.warn).toHaveBeenCalledWith(message, context, meta);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('Should call logger.error when the error method is called', () => {
      const message = 'error message';
      const context = 'context-test';
      const error = new Error('error test');
      const meta = { test: 'meta' };

      LoggerHelper.error(message, context, error, meta);

      expect(mockLogger.error).toHaveBeenCalledWith(message, context, error, meta);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
