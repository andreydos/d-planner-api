import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { Priority } from '@prisma/client'

export class TaskDto {
	@IsString()
	@IsOptional()
	name: string

	@IsDate()
	@IsOptional()
	createdAt?: Date

	@IsBoolean()
	@IsOptional()
	isCompleted: boolean

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({value}) => ('' + value).toLowerCase())
	priority: Priority
}
