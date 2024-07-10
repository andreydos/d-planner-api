import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TaskDto } from './dto/task.dto'
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return this.prisma.task.findMany({
			where: {
				userId: userId,
			}
		})
	}

	async getCompleted(userId: string) {
		return this.prisma.task.count({
			where: {
				userId: userId,
				isCompleted: true
			}
		})
	}

	async create(taskDto: TaskDto, userId: string) {
		return this.prisma.task.create({
			data: {
				...taskDto,
				user: {
					connect: {
						id: userId
					}
				},
			} as Prisma.TaskCreateInput
		})
	}

	async update(taskDto: Partial<TaskDto>, taskId: string, userId: string) {
		return this.prisma.task.update({
			where: {
				userId,
				id: taskId
			},
			data: taskDto as Prisma.TaskUpdateInput
		})
	}

	async delete(taskId: string) {
		return this.prisma.task.delete({
			where: {
				id: taskId
			}
		})
	}
}
