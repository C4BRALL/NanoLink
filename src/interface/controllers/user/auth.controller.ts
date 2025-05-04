import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { AuthUserService } from 'src/core/use-cases/user/auth-user.service';
import { LoginDto, LoginSchema } from 'src/interface/dtos/user/login-dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthUserService) {}

  @Post('signIn')
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
