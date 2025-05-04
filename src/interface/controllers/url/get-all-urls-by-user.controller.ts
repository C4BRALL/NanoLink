import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { InvalidUserDataError } from 'src/core/errors/user-error';
import { GetAllUrlsByUserService } from 'src/core/use-cases/url/get-all-urls-by-user.service';
import { GetAllUrlsByUserSchema } from 'src/interface/dtos/url/get-all-urls-by-user.dto';
import { AuthGuard } from 'src/interface/guards/auth.guard';

@ApiTags('URLs')
@Controller('url')
export class GetAllUrlsByUserController {
  constructor(private readonly getAllUrlsByUserService: GetAllUrlsByUserService) {}

  @UseGuards(AuthGuard)
  @ApiCookieAuth('token')
  @ApiBearerAuth()
  @Get('/all')
  @ApiOperation({
    summary: 'Get all URLs for authenticated user',
    description: 'Returns all shortened URLs created by the authenticated user',
  })
  @ApiResponse({ status: 200, description: 'List of URLs returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' })
  @ApiResponse({ status: 400, description: 'Invalid user ID format' })
  async getAllUrlsByUser(@Req() req: Request, @Res() res: Response) {
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    const result = GetAllUrlsByUserSchema.safeParse({ userId });
    if (!result.success) {
      const msg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new InvalidUserDataError(msg);
    }
    const urls = await this.getAllUrlsByUserService.execute(result.data.userId);

    res.status(200).json(urls);
  }
}
