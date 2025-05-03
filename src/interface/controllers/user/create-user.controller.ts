import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { CreateUserService } from 'src/core/use-cases/user/create-user.service';
import { CreateUserDto, CreateUserSchema } from 'src/interface/dtos/user/create-user.dto';

@Controller('user')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('/create')
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
