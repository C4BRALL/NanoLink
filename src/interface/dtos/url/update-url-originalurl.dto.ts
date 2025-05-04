import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const UpdateUrlOriginalUrlSchema = z.object({
  shortCode: z.string().min(6).max(6),
  originalUrl: z.string().url(),
});

export type UpdateUrlOriginalUrlDto = z.infer<typeof UpdateUrlOriginalUrlSchema>;

export class UpdateUrlOriginalUrlDtoClass {
  @ApiProperty({
    description: 'Short code of the URL (6 characters)',
    example: 'aZbKq7',
    type: String,
    minLength: 6,
    maxLength: 6,
  })
  shortCode: string;

  @ApiProperty({
    description: 'Original URL',
    example: 'https://www.example.com',
    type: String,
  })
  originalUrl: string;
}
