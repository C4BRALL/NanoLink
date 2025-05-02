import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponse {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2025-05-02T18:47:19.666Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/url/create',
  })
  path: string;

  @ApiProperty({
    description: 'Error message',
    example: 'An error occurred while processing the request',
  })
  message: string;
}

export class NotFoundErrorResponse extends ApiErrorResponse {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  override statusCode: number = 404;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2025-05-02T18:47:19.666Z',
  })
  override timestamp: string = new Date().toISOString();

  @ApiProperty({
    description: 'Request path',
    example: '/abc123',
  })
  override path: string = '/:shortCode';

  @ApiProperty({
    description: 'Error message',
    example: "URL with short code 'abc123' not found",
  })
  override message: string = 'URL not found';
}

export class ValidationErrorResponse extends ApiErrorResponse {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  override statusCode: number = 400;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2025-05-02T18:47:19.666Z',
  })
  override timestamp: string = new Date().toISOString();

  @ApiProperty({
    description: 'Request path',
    example: '/url/create',
  })
  override path: string = '/url/create';

  @ApiProperty({
    description: 'Validation error message',
    example: 'originalUrl: Invalid url',
  })
  override message: string = 'Validation error';
}

export class ShortUrlValidationErrorResponse extends ApiErrorResponse {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  override statusCode: number = 400;

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: '2025-05-02T18:47:19.666Z',
  })
  override timestamp: string = new Date().toISOString();

  @ApiProperty({
    description: 'Request path',
    example: '/Ow4T62',
  })
  override path: string = '/:shortCode';

  @ApiProperty({
    description: 'Validation error message',
    example: 'The provided short code "shortCode: String must contain at least 6 character(s)" is invalid',
  })
  override message: string = 'URL not found';
}
