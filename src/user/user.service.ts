import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AuthDto } from '../auth/dto/auth.dto'
import { hash } from 'argon2'
import { UserDto } from './dto/user.dto'
import { startOfDay, subDays } from 'date-fns'

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

	async getProfile(id: string) {
		const profile = await this.getById(id)
		if (profile) {
			const totalTasks = profile.tasks.length
			const completedTasks = await this.prisma.task.count({ //TODO: move to task service
				where: {
					userId: id,
					isCompleted: true
				}
			})
			const today = startOfDay(new Date())
			const lastWeekStart = startOfDay(subDays(new Date(), 7))
			const todayTasks = await this.prisma.task.count({
				where: {
					userId: id,
					createdAt: {
						gte : today.toISOString()
					}
				}
			})
			const lastWeekTasks = await this.prisma.task.count({
				where: {
					userId: id,
					createdAt: {
						gte : lastWeekStart.toISOString()
					}
				}
			})

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const {password, ...userProfile} = profile

			return {
				user: userProfile,
				statistics: [
					{label: 'Today', value: totalTasks},
					{label: 'Completed tasks', value: completedTasks},
					{label: 'Today tasks', value: todayTasks},
					{label: 'Week tasks', value: lastWeekTasks},
				]
			}
		} else {
			throw new NotFoundException('User does not exist');
		}
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

	async update(id: string, dto: UserDto) {
		let data = dto;

		if (dto.password) {
			data = {
				...dto,
				password: await hash(dto.password),
			}
		}

		return this.prisma.user.update({
			where: {id},
			data,
			select: {
				name: true,
				email: true,
			}
		})
	}
}
