import { ApiProperty } from '@nestjs/swagger';

export class UrlEntitySwagger {
  @ApiProperty({
    description: 'URL ID',
    example: 'd5d46e22-f1cc-4991-b461-b17a316ca545',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Short code of the URL (6 characters)',
    example: 'aZbKq7',
    type: String,
  })
  shortCode: string;

  @ApiProperty({
    description: 'Original URL',
    example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    type: String,
  })
  originalUrl: string;

  @ApiProperty({
    description: 'User ID (optional)',
    example: 'cc435f3c-6c26-40ef-abe8-635a475c8a7c',
    type: String,
    required: false,
    nullable: true,
  })
  userId?: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-05-01T12:00:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Update date',
    example: '2023-05-01T12:00:00.000Z',
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Deletion date (if applicable)',
    example: null,
    type: Date,
    required: false,
    nullable: true,
  })
  deletedAt?: Date;

  @ApiProperty({
    description: 'Number of clicks on the URL',
    example: 42,
    type: Number,
  })
  clickCount: number;

  @ApiProperty({
    description: 'Last click date',
    example: '2023-05-01T15:30:00.000Z',
    type: Date,
    required: false,
    nullable: true,
  })
  lastClickDate?: Date;
}

export class CreateUrlResponseSwagger {
  @ApiProperty({
    description: 'Created URL data',
    type: UrlEntitySwagger,
  })
  url: UrlEntitySwagger;

  @ApiProperty({
    description: 'Shortened URL link',
    example: 'http://localhost:3000/aZbKq7',
    type: String,
  })
  link: string;
}

export class DeleteUrlResponseSwagger {
  @ApiProperty({
    description: 'Success message',
    example: 'URL deleted successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Short code of the deleted URL',
    example: 'aZbKq7',
    type: String,
  })
  shortCode: string;

  @ApiProperty({
    description: 'Original URL that was shortened',
    example: 'https://example.com/long-url-path',
    type: String,
  })
  originalUrl: string;
}

export class UpdateUrlResponseSwagger {
  @ApiProperty({
    description: 'Success message',
    example: 'URL updated successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Short code of the updated URL',
    example: 'aZbKq7',
    type: String,
  })
  shortCode: string;

  @ApiProperty({
    description: 'New original URL',
    example: 'https://www.updated-example.com',
    type: String,
  })
  originalUrl: string;
}
