import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateUrlSchema = z.object({
  originalUrl: z.string().url(),
  userId: z.string().uuid().optional(),
});

export type CreateUrlDto = z.infer<typeof CreateUrlSchema>;

export class CreateUrlDtoClass {
  @ApiProperty({
    description: 'Original URL that will be shortened',
    example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
    type: String,
    required: true,
  })
  originalUrl: string;

  @ApiProperty({
    description: 'User ID (optional, only for authenticated users)',
    example: 'cc435f3c-6c26-40ef-abe8-635a475c8a7c',
    type: String,
    required: false,
    nullable: true,
  })
  userId?: string;
}
