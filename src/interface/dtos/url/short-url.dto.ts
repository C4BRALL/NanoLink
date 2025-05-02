import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const ShortUrlSchema = z.object({
  shortCode: z.string().min(6).max(6),
});

export type ShortUrlDto = z.infer<typeof ShortUrlSchema>;

export class ShortUrlDtoClass {
  @ApiProperty({
    description: 'Short code of the URL (6 characters)',
    example: 'aZbKq7',
    type: String,
    minLength: 6,
    maxLength: 6,
  })
  shortCode: string;
}
