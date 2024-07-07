import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: AuthDto, @Res({passthrough: true}) res: Response) {
    const {refreshToken, ...response} = await this.authService.login(dto)
    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() dto: AuthDto, @Res({passthrough: true}) res: Response) {
    const {refreshToken, ...response} = await this.authService.register(dto);

    this.authService.removeRefreshTokenToResponse(res)

    return response
  }

  @HttpCode(HttpStatus.OK)
  @Post('login/access-token')
  async getNewTokens(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME]

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenToResponse(res)
      throw new UnauthorizedException('Refresh token not found')
    }

    const {refreshToken, ...response} = await this.authService.getNewTokens(refreshTokenFromCookies)

    this.authService.addRefreshTokenToResponse(res, refreshToken)

    return response
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({passthrough: true}) res: Response) {
    this.authService.removeRefreshTokenToResponse(res)
    return true
  }
}
