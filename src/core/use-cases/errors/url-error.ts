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
