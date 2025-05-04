import { ApiProperty } from '@nestjs/swagger';

export class UserEntitySwagger {
  @ApiProperty({
    description: 'User ID',
    example: 'd5d46e22-f1cc-4991-b461-b17a316ca545',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@gmail.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    type: String,
    required: false,
    nullable: true,
  })
  password?: string;

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
}

export class CreateUserResponseSwagger {
  @ApiProperty({
    description: 'Created user data',
    type: UserEntitySwagger,
  })
  user: UserEntitySwagger;

  @ApiProperty({
    description: 'JWT token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    type: String,
  })
  token: string;
}

export class LoginResponseSwagger {
  @ApiProperty({
    description: 'JWT token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  token: string;

  @ApiProperty({
    description: 'User data',
    type: UserEntitySwagger,
  })
  user: UserEntitySwagger;
}
