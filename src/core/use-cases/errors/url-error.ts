import { ApplicationError } from './application-error';

export class UrlCreationFailedError extends ApplicationError {
  constructor(originalUrl: string, cause?: Error) {
    super(`Failed to create short URL for "${originalUrl}"`);
    this.cause = cause;
  }
}

export class UrlRetrievalFailedError extends ApplicationError {
  constructor(shortCode: string, cause?: Error) {
    super(`Failed to retrieve URL for short code "${shortCode}"`);
    this.cause = cause;
  }
}

export class UrlDeletionFailedError extends ApplicationError {
  constructor(shortCode: string, cause?: Error) {
    super(`Failed to delete URL for short code "${shortCode}"`);
    this.cause = cause;
  }
}

export class UrlUpdateFailedError extends ApplicationError {
  constructor(shortCode: string, cause?: Error) {
    super(`Failed to update URL for short code "${shortCode}"`);
    this.cause = cause;
  }
}

export class UrlAccessDeniedError extends ApplicationError {
  constructor(shortCode: string, userId: string) {
    super(`User ${userId} is not allowed to access URL with short code "${shortCode}"`);
  }
}
