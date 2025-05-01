import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { DomainError } from 'src/core/errors/domain-error';
import { EntityNotFoundError, QueryFailedError, EntityNotFoundError as TypeORMEntityNotFoundError, TypeORMError } from 'typeorm';
import { DatabaseError, DuplicateEntryError, InvalidRelationError } from 'src/core/errors/database-error';
import { UrlCreationFailedError } from 'src/core/errors/url-error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('Exception caught:', exception);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details = null;
    let code = 'INTERNAL_ERROR';

    const actualException = this.unwrapException(exception);

    if (actualException instanceof HttpException) {
      status = actualException.getStatus();
      const exceptionResponse = actualException.getResponse();

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = String(exceptionResponse['message']);
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (actualException instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;

      if (actualException.driverError && actualException.driverError.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'A record with this value already exists';
        code = 'DUPLICATE_ENTRY';

        const detail = actualException.driverError.detail;
        if (detail) {
          details = { detail };
        }
      } else if (actualException.driverError && actualException.driverError.code === '23503') {
        status = HttpStatus.BAD_REQUEST;

        if (actualException.driverError.detail) {
          const matches = actualException.driverError.detail.match(/Key \((.+?)\)=\((.+?)\) is not present in table "(.+?)"/);

          if (matches) {
            const [_, field, value, table] = matches;

            if (field === 'user_id' && table === 'users') {
              message = `The user informed does not exist.`;
            } else {
              message = `The reference to ${field} with value "${value}" does not exist in ${table}.`;
            }

            code = 'FOREIGN_KEY_VIOLATION';
            details = {
              field,
              value,
              table,
              constraint: actualException.driverError.constraint,
            };
          } else {
            message = 'The operation failed because a reference does not exist in the system.';
            code = 'FOREIGN_KEY_VIOLATION';
            details = { detail: actualException.driverError.detail };
          }
        } else {
          message = 'Foreign key violation';
          code = 'FOREIGN_KEY_VIOLATION';
        }
      } else {
        message = 'Database operation error';
        code = 'DB_QUERY_FAILED';
        if (process.env.NODE_ENV !== 'production') {
          details = {
            query: actualException.query,
            parameters: actualException.parameters,
            driverError: actualException.driverError,
          };
        }
      }
    } else if (actualException instanceof TypeORMEntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
      code = 'ENTITY_NOT_FOUND';
    } else if (actualException instanceof TypeORMError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database operation error';
      code = 'DB_ERROR';

      if (process.env.NODE_ENV !== 'production') {
        details = { error: actualException.message };
      }
    } else if (actualException instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = actualException.message;
      code = 'ENTITY_NOT_FOUND';
    } else if (actualException instanceof DuplicateEntryError) {
      status = HttpStatus.CONFLICT;
      message = actualException.message;
      code = 'DUPLICATE_ENTRY';
    } else if (actualException instanceof InvalidRelationError) {
      status = HttpStatus.BAD_REQUEST;
      message = actualException.message;
      code = 'INVALID_RELATION';
    } else if (actualException instanceof DatabaseError) {
      status = HttpStatus.BAD_REQUEST;
      message = actualException.message;
      code = 'DATABASE_ERROR';

      if (process.env.NODE_ENV !== 'production' && actualException.cause) {
        details = { cause: actualException.cause };
      }
    } else if (actualException instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error';
      details = actualException.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
    } else if (actualException instanceof DomainError) {
      status = HttpStatus.BAD_REQUEST;
      message = actualException.message;
    } else if (actualException instanceof Error) {
      message = actualException.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(details ? { details } : {}),
    });
  }

  private unwrapException(exception: unknown): unknown {
    if (exception instanceof UrlCreationFailedError && exception.cause) {
      return this.unwrapException(exception.cause);
    }

    if (exception instanceof Error && 'cause' in exception && exception.cause instanceof Error) {
      return this.unwrapException(exception.cause);
    }

    return exception;
  }
}
