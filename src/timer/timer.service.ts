import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { TimerRoundDto, TimerSessionDto } from './dto/timer.dto'

@Injectable()
export class TimerService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
	) {}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0];

		return this.prisma.pomodoroSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today)
				},
				userId
			},
			include: {
				pomodoroRounds: {
					orderBy: {
						id: 'asc'
					}
				}
			}
		})
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId)

		if (todaySession) {
			return todaySession
		}

		const user = await this.userService.getUserIntervalsCountByUserId(userId)

		if (!user) {
			throw new NotFoundException('User does not exist')
		}

		return this.prisma.pomodoroSession.create({
			data: {
				pomodoroRounds: {
					createMany: {
						data: Array.from({ length: user.intervalsCount }, () => {
							return {totalSeconds: 0}
						}),
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				pomodoroRounds: true
			}
		})
	}

	async update(
		dto: Partial<TimerSessionDto>,
		timerId: string,
		userId: string) {
		return this.prisma.pomodoroSession.update({
			where: { id: timerId, userId },
			data: dto
		})
	}

	async updateRound(
		dto: Partial<TimerRoundDto>,
		roundId: string) {
		return this.prisma.pomodoroRound.update({
			where: { id: roundId },
			data: dto
		})
	}

	async deleteSession(sessionId: string, userId: string) {
		return this.prisma.pomodoroSession.delete({
			where: { id: sessionId, userId }
		})
	}
}
