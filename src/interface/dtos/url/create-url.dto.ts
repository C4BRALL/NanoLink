import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export const CreateUrlSchema = z.object({
  originalUrl: z.string().url(),
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
}
