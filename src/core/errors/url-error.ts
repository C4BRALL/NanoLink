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
