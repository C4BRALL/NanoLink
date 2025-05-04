import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { AuthUserService } from 'src/core/use-cases/user/auth-user.service';
import { LoginDto, LoginDtoClass, LoginSchema } from 'src/interface/dtos/user/login-dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthUserService) {}

  @Post('signIn')
  @ApiOperation({ summary: 'Authenticate user', description: 'Validates user credentials and returns a JWT token' })
  @ApiBody({
    type: LoginDtoClass,
    description: 'User credentials',
    examples: {
      userLogin: {
        value: {
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User authenticated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      const msg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new InvalidUserDataError(msg);
    }
    const authenticatedUser = await this.authService.execute({
      email: result.data.email,
      password: result.data.password,
    });

    res.cookie('token', authenticatedUser.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
      sameSite: 'strict',
    });

    res.status(200).json(authenticatedUser);
  }
}
