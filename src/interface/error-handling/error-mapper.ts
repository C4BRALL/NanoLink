import { BadRequestException, NotFoundException, InternalServerErrorException, HttpException } from '@nestjs/common';
import { ZodError } from 'zod';
import { InvalidShortCodeError, InvalidUrlError, UrlNotFoundError } from 'src/core/errors/url-error';
import { UserNotFoundError } from 'src/core/errors/user-error';
import { UrlCreationFailedError, UrlRetrievalFailedError } from 'src/core/use-cases/errors/url-error';

export class ErrorMapper {
  static toHttpException(error: Error): HttpException {
    if (error instanceof InvalidUrlError || error instanceof InvalidShortCodeError) {
      return new BadRequestException(error.message);
    }

    if (error instanceof UrlNotFoundError || error instanceof UserNotFoundError) {
      return new NotFoundException(error.message);
    }

    if (error instanceof UrlCreationFailedError) {
      return new BadRequestException(error.message);
    }

    if (error instanceof UrlRetrievalFailedError) {
      return new NotFoundException(error.message);
    }

    if (error instanceof ZodError) {
      return this.handleZodError(error);
    }

    console.error('Unhandled error:', error);
    return new InternalServerErrorException('An unexpected error occurred');
  }

  private static handleZodError(error: ZodError): BadRequestException {
    const formattedErrors = error.errors.map((err) => {
      if (err.message === 'Required') {
        return {
          field: err.path.join('.'),
          message: `O campo ${err.path.join('.')} é obrigatório`,
        };
      }

      if (err.code === 'invalid_string' && err.validation === 'url') {
        return {
          field: err.path.join('.'),
          message: `O valor informado não é uma URL válida`,
        };
      }

      if (err.code === 'invalid_string' && err.validation === 'email') {
        return {
          field: err.path.join('.'),
          message: `O email informado não é válido`,
        };
      }

      if (err.code === 'too_small') {
        return {
          field: err.path.join('.'),
          message: `O campo ${err.path.join('.')} deve ter pelo menos ${err.minimum} caracteres`,
        };
      }

      if (err.code === 'invalid_string' && err.validation === 'uuid') {
        return {
          field: err.path.join('.'),
          message: `O valor informado não é um ID válido`,
        };
      }

      return {
        field: err.path.join('.'),
        message: err.message,
      };
    });

    return new BadRequestException({
      message: 'Existem erros de validação nos dados enviados',
      errors: formattedErrors,
    });
  }
}
