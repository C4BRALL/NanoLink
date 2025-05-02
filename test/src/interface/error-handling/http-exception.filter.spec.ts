import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { DomainError } from 'src/core/errors/domain-error';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { DatabaseError, DuplicateEntryError, InvalidRelationError } from 'src/core/errors/database-error';
import { UrlCreationFailedError } from 'src/core/errors/url-error';
import { HttpExceptionFilter } from 'src/interface/error-handling/http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockGetRequest: jest.Mock;
  let mockResponse: Partial<Response>;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockGetRequest = jest.fn().mockReturnValue({ url: '/test-url' });

    mockResponse = {
      status: mockStatus,
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: mockGetRequest,
      }),
    } as unknown as ArgumentsHost;

    filter = new HttpExceptionFilter();

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Test error message', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test error message',
        path: '/test-url',
      }),
    );
  });

  it('should handle HttpException with object response', () => {
    const exception = new HttpException({ message: 'Test error object' }, HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test error object',
        path: '/test-url',
      }),
    );
  });

  it('should handle QueryFailedError with duplicate entry', () => {
    const driverError = {
      code: '23505',
      detail: 'Key (email)=(test@example.com) already exists',
    };

    const exception = new QueryFailedError('query', [], { driverError } as any);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.CONFLICT,
        message: 'A record with this value already exists',
        path: '/test-url',
        details: { detail: driverError.detail },
      }),
    );
  });

  it('should handle QueryFailedError with foreign key violation', () => {
    const driverError = {
      code: '23503',
      detail: 'Key (user_id)=(123) is not present in table "users"',
      constraint: 'user_id_fkey',
    };

    const exception = new QueryFailedError('query', [], { driverError } as any);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'The user informed does not exist.',
        path: '/test-url',
        details: {
          field: 'user_id',
          value: '123',
          table: 'users',
          constraint: 'user_id_fkey',
        },
      }),
    );
  });

  it('should handle general QueryFailedError', () => {
    const exception = new QueryFailedError('SELECT * FROM users', [], new Error('Database error'));

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Database operation error',
        path: '/test-url',
        details: expect.objectContaining({
          query: 'SELECT * FROM users',
          parameters: [],
        }),
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle EntityNotFoundError', () => {
    const exception = new EntityNotFoundError('User', '123');

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found',
        path: '/test-url',
      }),
    );
  });

  it('should handle TypeORMError', () => {
    const exception = new TypeORMError('Database connection error');

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Database operation error',
        path: '/test-url',
        details: {
          error: 'Database connection error',
        },
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle DuplicateEntryError', () => {
    const exception = new DuplicateEntryError('Email already exists', 'email');

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Database error: A Email already exists with this value of email already exists',
        path: '/test-url',
      }),
    );
  });

  it('should handle InvalidRelationError', () => {
    const exception = new InvalidRelationError('User not found', 'userId');

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Database error: userId',
        path: '/test-url',
      }),
    );
  });

  it('should handle DatabaseError with cause', () => {
    const cause = new Error('Connection refused');
    const exception = new DatabaseError('Failed to connect to database', cause);

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Connection refused',
        path: '/test-url',
      }),
    );

    process.env.NODE_ENV = originalEnv;
  });

  it('should handle ZodError', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: ['email'],
        message: 'Required',
      },
      {
        code: 'invalid_string',
        validation: 'url',
        path: ['website'],
        message: 'Invalid url',
      },
    ]);

    filter.catch(zodError, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation error',
        path: '/test-url',
        details: [
          { field: 'email', message: 'Required' },
          { field: 'website', message: 'Invalid url' },
        ],
      }),
    );
  });

  it('should handle DomainError', () => {
    class CustomDomainError extends DomainError {
      constructor() {
        super('Custom domain error');
      }
    }

    const exception = new CustomDomainError();

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Custom domain error',
        path: '/test-url',
      }),
    );
  });

  it('should handle generic Error', () => {
    const exception = new Error('Generic error');

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Generic error',
        path: '/test-url',
      }),
    );
  });

  it('should unwrap nested errors in UrlCreationFailedError', () => {
    const nestedError = new EntityNotFoundError('User', '123');
    const exception = new UrlCreationFailedError('Failed to create URL', nestedError);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Resource not found',
        path: '/test-url',
      }),
    );
  });

  it('should handle unknown exception types', () => {
    filter.catch(null, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        path: '/test-url',
      }),
    );
  });
});
