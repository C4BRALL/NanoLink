import { Injectable } from '@nestjs/common';
import { DatabaseError, DuplicateEntryError, EntityNotFoundError, InvalidRelationError } from 'src/core/errors/database-error';
import { QueryFailedError, EntityNotFoundError as TypeORMEntityNotFoundError, TypeORMError } from 'typeorm';

@Injectable()
export class DatabaseErrorHandler {
  handleError(error: unknown, entityName: string): never {
    console.error(`Database error in ${entityName} repository:`, error);

    if (error instanceof QueryFailedError) {
      if (error.driverError) {
        if (error.driverError.code === '23505') {
          const match = error.driverError.detail?.match(/Key \((.+?)\)=/);
          const field = match ? match[1] : 'field';
          throw new DuplicateEntryError(entityName, field);
        }

        if (error.driverError.code === '23503') {
          const matches = error.driverError.detail?.match(/Key \((.+?)\)=\((.+?)\) is not present in table "(.+?)"/);

          if (matches) {
            const [_, field, value, table] = matches;

            if (field === 'user_id' && table === 'users') {
              throw new InvalidRelationError(
                entityName,
                `The user with ID ${value} does not exist. You must create the user before associating it with a URL.`,
              );
            } else {
              throw new InvalidRelationError(entityName, `The reference to ${field} with value "${value}" does not exist in ${table}.`);
            }
          }

          throw new InvalidRelationError(entityName, error.driverError.detail || 'Invalid reference');
        }
      }

      throw new DatabaseError(`Failed operation: ${error.message}`, error);
    }

    if (error instanceof TypeORMEntityNotFoundError) {
      throw new EntityNotFoundError(entityName, 'requested');
    }

    if (error instanceof TypeORMError) {
      throw new DatabaseError(`TypeORM error: ${error.message}`, error);
    }

    if (error instanceof Error) {
      throw new DatabaseError(error.message, error);
    }

    throw new DatabaseError('Unknown database error', error);
  }
}
