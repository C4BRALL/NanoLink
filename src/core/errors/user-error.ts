import { DomainError } from './domain-error';

export class InvalidUserDataError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`User with id "${id}" not found`);
  }
}
