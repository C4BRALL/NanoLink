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
    it('deve configurar o logger corretamente', () => {
      LoggerHelper.setLogger(mockLogger);

      // @ts-ignore
      expect(LoggerHelper['logger']).toBe(mockLogger);
    });
  });

  describe('quando o logger não está configurado', () => {
    it('deve usar console.debug quando o método debug é chamado', () => {
      const message = 'mensagem de debug';
      const context = 'contexto-teste';
      const meta = { test: 'meta' };

      LoggerHelper.debug(message, context, meta);

      expect(consoleDebugSpy).toHaveBeenCalledWith(`[DEBUG] [${context}]: ${message}`, meta);
    });

    it('deve usar console.info quando o método info é chamado', () => {
      const message = 'mensagem de info';
      const context = 'contexto-teste';
      const meta = { test: 'meta' };

      LoggerHelper.info(message, context, meta);

      expect(consoleInfoSpy).toHaveBeenCalledWith(`[INFO] [${context}]: ${message}`, meta);
    });

    it('deve usar console.warn quando o método warn é chamado', () => {
      const message = 'mensagem de warn';
      const context = 'contexto-teste';
      const meta = { test: 'meta' };

      LoggerHelper.warn(message, context, meta);

      expect(consoleWarnSpy).toHaveBeenCalledWith(`[WARN] [${context}]: ${message}`, meta);
    });

    it('deve usar console.error quando o método error é chamado', () => {
      const message = 'mensagem de erro';
      const context = 'contexto-teste';
      const error = new Error('teste de erro');
      const meta = { test: 'meta' };

      LoggerHelper.error(message, context, error, meta);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `[ERROR] [${context}]: ${message}`,
        { message: error.message, stack: error.stack },
        meta,
      );
    });

    it('deve usar "General" como contexto padrão quando o contexto não é fornecido', () => {
      const message = 'mensagem sem contexto';

      LoggerHelper.debug(message);

      expect(consoleDebugSpy).toHaveBeenCalledWith(`[DEBUG] [General]: ${message}`, undefined);
    });
  });

  describe('quando o logger está configurado', () => {
    beforeEach(() => {
      LoggerHelper.setLogger(mockLogger);
    });

    it('deve chamar logger.debug quando o método debug é chamado', () => {
      const message = 'mensagem de debug';
      const context = 'contexto-teste';
      const meta = { test: 'meta' };

      LoggerHelper.debug(message, context, meta);

      expect(mockLogger.debug).toHaveBeenCalledWith(message, context, meta);
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('deve chamar logger.info quando o método info é chamado', () => {
      const message = 'mensagem de info';
      const context = 'contexto-teste';
      const meta = { test: 'meta' };

      LoggerHelper.info(message, context, meta);

      expect(mockLogger.info).toHaveBeenCalledWith(message, context, meta);
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('deve chamar logger.warn quando o método warn é chamado', () => {
      const message = 'mensagem de warn';
      const context = 'contexto-teste';
      const meta = { test: 'meta' };

      LoggerHelper.warn(message, context, meta);

      expect(mockLogger.warn).toHaveBeenCalledWith(message, context, meta);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('deve chamar logger.error quando o método error é chamado', () => {
      const message = 'mensagem de erro';
      const context = 'contexto-teste';
      const error = new Error('teste de erro');
      const meta = { test: 'meta' };

      LoggerHelper.error(message, context, error, meta);

      expect(mockLogger.error).toHaveBeenCalledWith(message, context, error, meta);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
