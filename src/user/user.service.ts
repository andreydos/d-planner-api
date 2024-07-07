import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Observable } from 'rxjs'
import { AuthDto } from '../auth/dto/auth.dto'
import { hash } from 'argon2'
import { use } from 'passport'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				tasks: true
			}
		})
	}

	getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			}
		})
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			name: '',
			password: await hash(dto.password),
		}

		return this.prisma.user.create({
			data: user
		})
	}
}
