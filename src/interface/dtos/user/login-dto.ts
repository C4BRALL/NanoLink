import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export class LoginDtoClass implements LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@gmail.com',
    type: String,
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    type: String,
    required: true,
    minLength: 6,
  })
  password: string;
}
