import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const DeleteUrlSchema = z.object({
  shortCode: z.string().min(6).max(6),
});

export type DeleteUrlDto = z.infer<typeof DeleteUrlSchema>;

export class DeleteUrlDtoClass {
  @ApiProperty({
    description: 'Short code of the URL (6 characters)',
    example: 'aZbKq7',
    type: String,
    minLength: 6,
    maxLength: 6,
  })
  shortCode: string;
}
