import { Injectable, OnModuleInit } from '@nestjs/common';
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import * as winston from 'winston';
import { LoggerInterface } from 'src/core/domain/logger/logger.interface';
import { LoggerHelper } from 'src/core/domain/helpers/logger.helper';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';

@Injectable()
export class WinstonLoggerService implements LoggerInterface, OnModuleInit {
  private logger: winston.Logger;
  private logtail: Logtail | null = null;

  constructor(private readonly configService: EnvironmentConfigService) {
    const logtailEndpoint = this.configService.get('LOGTAIL_ENDPOINT');
    const logtailToken = this.configService.get('LOGTAIL_TOKEN');
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    const transports: winston.transport[] = [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
            return `${timestamp} [${level}] [${context || 'General'}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
          }),
        ),
      }),
    ];

    if (logtailToken) {
      this.logtail = new Logtail(logtailToken, { endpoint: logtailEndpoint });
      transports.push(new LogtailTransport(this.logtail));
    }

    this.logger = winston.createLogger({
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      defaultMeta: { service: 'nano-link' },
      transports,
    });
  }

  onModuleInit() {
    LoggerHelper.setLogger(this);
    LoggerHelper.info('Logger initialized', 'WinstonLoggerService');
  }

  debug(message: string, context?: string, meta: Record<string, any> = {}): void {
    this.logger.debug(message, { context, ...meta });
    this.flush();
  }

  info(message: string, context?: string, meta: Record<string, any> = {}): void {
    this.logger.info(message, { context, ...meta });
    this.flush();
  }

  warn(message: string, context?: string, meta: Record<string, any> = {}): void {
    this.logger.warn(message, { context, ...meta });
    this.flush();
  }

  error(message: string, context?: string, error?: Error, meta: Record<string, any> = {}): void {
    this.logger.error(message, {
      context,
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : undefined,
      ...meta,
    });
    this.flush();
  }

  flush(): Promise<void> {
    if (this.logtail) {
      return this.logtail.flush();
    }
    return Promise.resolve();
  }
}
