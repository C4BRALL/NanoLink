import { DomainError } from './domain-error';

export class InvalidUrlError extends DomainError {
  constructor(url: string) {
    super(`The provided URL "${url}" is invalid`);
  }
}

export class InvalidShortCodeError extends DomainError {
  constructor(shortCode: string) {
    super(`The provided short code "${shortCode}" is invalid`);
  }
}

export class UrlNotFoundError extends DomainError {
  constructor(shortCode: string) {
    super(`URL with short code "${shortCode}" not found`);
  }
}

export class UrlCreationFailedError extends Error {
  constructor(
    originalUrl: string,
    public readonly cause?: Error,
  ) {
    super(`Failed to create short URL for "${originalUrl}"`);
    this.name = 'UrlCreationFailedError';

    // Garantir que o protótipo seja mantido
    Object.setPrototypeOf(this, UrlCreationFailedError.prototype);

    // Capturar stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
