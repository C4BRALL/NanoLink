import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerHelper } from 'src/core/domain/helpers/logger.helper';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, params, query, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const responseTime = Date.now() - startTime;
          LoggerHelper.info(`${method} ${url} ${responseTime}ms`, 'HTTP', {
            method,
            url,
            params,
            query,
            ip,
            userAgent,
            responseTime,
            body: this.sanitizeBody(body),
            response: this.sanitizeResponseBody(responseBody),
            statusCode: context.switchToHttp().getResponse().statusCode,
          });
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          LoggerHelper.error(`${method} ${url} ${responseTime}ms`, 'HTTP', error, {
            method,
            url,
            params,
            query,
            ip,
            userAgent,
            responseTime,
            body: this.sanitizeBody(body),
            errorName: error.name,
            errorMessage: error.message,
            statusCode: error.status || error.statusCode || 500,
            errorStack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return {};

    const sanitized = { ...body };
    if (sanitized.password) sanitized.password = '[REDACTED]';

    return sanitized;
  }

  private sanitizeResponseBody(responseBody: any): any {
    if (!responseBody) return {};

    if (typeof responseBody === 'object') {
      const sanitized = { ...responseBody };
      if (sanitized.token) sanitized.token = '[REDACTED]';
      return sanitized;
    }
    return responseBody;
  }
}
