export interface LoggerInterface {
  debug(message: string, context?: string, meta?: Record<string, any>): void;
  info(message: string, context?: string, meta?: Record<string, any>): void;
  warn(message: string, context?: string, meta?: Record<string, any>): void;
  error(message: string, context?: string, error?: Error, meta?: Record<string, any>): void;
}
