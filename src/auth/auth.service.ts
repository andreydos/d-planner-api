import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { AuthDto } from './dto/auth.dto'
import { verify } from 'argon2'
import { Response } from 'express'
import { CookieOptions } from 'express-serve-static-core'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwt: JwtService,
		private readonly userService: UserService,
		private configService: ConfigService,
	) {}

	REFRESH_TOKEN_NAME = 'refreshToken'
	EXPIRE_DAY_REFRESH_TOKEN = 1
	BASE_COOKIE_OPTIONS = {
		httpOnly: true,
		domain: this.configService.get('PRODUCTION_DOMAIN'),
		secure: false,
		sameSite: this.configService.get('COOKIE_SAME_SITE_MODE'), // lax in production
	} as CookieOptions

	async login(dto: AuthDto) {
		const {password, ...user} = await this.validateUser(dto);
		const tokens = this.issueToken(user.id);

		return {
			user,
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const existingUser = await this.userService.getByEmail(dto.email)
		if (existingUser) {
			throw new BadRequestException('User already exists')
		}

		const {password, ...user} = await this.userService.create(dto);
		const tokens = this.issueToken(user.id);

		return {
			user,
			...tokens
		}
	}

	private issueToken(userId: string) {
		const data = {id: userId};

		const accessToken = this.jwt.sign(data, {
			expiresIn: '15m',
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '3d',
		})

		return { accessToken, refreshToken }
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) {
			throw new UnauthorizedException('Refresh token is not valid')
		}

		const {password, ...user } = await this.userService.getById(result.id)
		const tokens = this.issueToken(user.id)

		return {
			user,
			...tokens
		}
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email);

		if (!user) {
			throw new NotFoundException('User does not exist');
		}

		const isValid = await verify(user.password, dto.password);

		if (!isValid) {
			throw new UnauthorizedException('Invalid email or password');
		}

		return user;
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			...this.BASE_COOKIE_OPTIONS,
			expires: expiresIn
		})
	}

	removeRefreshTokenToResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			...this.BASE_COOKIE_OPTIONS,
			expires: new Date(0)
		})
	}
}
