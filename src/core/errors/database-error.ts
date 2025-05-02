import { DomainError } from './domain-error';

export class DatabaseError extends DomainError {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(`Database error: ${message}`);
    this.name = 'DatabaseError';
  }
}

export class EntityNotFoundError extends DatabaseError {
  constructor(entity: string, identifier: string | number) {
    super(`${entity} with identifier ${identifier} not found`);
    this.name = 'EntityNotFoundError';
  }
}

export class DuplicateEntryError extends DatabaseError {
  constructor(entity: string, field: string) {
    super(`A ${entity} with this value of ${field} already exists`);
    this.name = 'DuplicateEntryError';
  }
}

export class InvalidRelationError extends DatabaseError {
  constructor(entity: string, message: string) {
    super(message);
    this.name = 'InvalidRelationError';
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message?: string) {
    super(message || 'Database connection error');
    this.name = 'DatabaseConnectionError';
  }
}
