import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name must be at least 1 character long' }),
  email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' }),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export class CreateUserDtoClass implements CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    type: String,
    required: true,
  })
  name: string;

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
