import { LoggerInterface } from '../logger/logger.interface';

export class LoggerHelper {
  private static logger: LoggerInterface;

  public static setLogger(logger: LoggerInterface): void {
    this.logger = logger;
  }

  public static debug(message: string, context?: string, meta?: Record<string, any>): void {
    if (!this.logger) {
      console.debug(`[DEBUG] [${context || 'General'}]: ${message}`, meta);
      return;
    }
    this.logger.debug(message, context, meta);
  }

  public static info(message: string, context?: string, meta?: Record<string, any>): void {
    if (!this.logger) {
      console.info(`[INFO] [${context || 'General'}]: ${message}`, meta);
      return;
    }
    this.logger.info(message, context, meta);
  }

  public static warn(message: string, context?: string, meta?: Record<string, any>): void {
    if (!this.logger) {
      console.warn(`[WARN] [${context || 'General'}]: ${message}`, meta);
      return;
    }
    this.logger.warn(message, context, meta);
  }

  public static error(message: string, context?: string, error?: Error, meta?: Record<string, any>): void {
    if (!this.logger) {
      console.error(`[ERROR] [${context || 'General'}]: ${message}`, error ? { message: error.message, stack: error.stack } : {}, meta);
      return;
    }
    this.logger.error(message, context, error, meta);
  }
}
