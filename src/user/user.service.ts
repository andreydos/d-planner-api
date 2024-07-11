import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AuthDto } from '../auth/dto/auth.dto'
import { hash } from 'argon2'
import { UserDto } from './dto/user.dto'
import { startOfDay, subDays } from 'date-fns'
import { TaskService } from '../task/task.service'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private taskService: TaskService
	) {}

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

	getUserWithTasksById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				tasks: true
			}
		})
	}

	getUserIntervalsCountByUserId(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				intervalsCount: true
			}
		})
	}

	async getProfile(id: string) {
		const profile = await this.getUserWithTasksById(id)
		if (profile) {
			const totalTasks = profile.tasks.length
			const completedTasks = await this.taskService.getCompleted(id);
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
