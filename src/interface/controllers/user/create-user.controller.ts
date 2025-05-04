import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { CreateUserService } from 'src/core/use-cases/user/create-user.service';
import { CreateUserDto, CreateUserDtoClass, CreateUserSchema } from 'src/interface/dtos/user/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Register new user', description: 'Creates a new user account and returns a JWT token' })
  @ApiBody({
    type: CreateUserDtoClass,
    description: 'User registration data',
    examples: {
      newUser: {
        value: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const result = CreateUserSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      throw new InvalidUserDataError(errorMessage);
    }
    const user = await this.createUserService.execute(result.data);

    res.status(201).json(user);
  }
}
