import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { Priority } from '@prisma/client'

export class TaskDto {
	@IsString()
	@IsOptional()
	name: string

	@IsDate()
	@IsOptional()
	@Transform(({ value }) => (value ? new Date(value) : undefined), { toClassOnly: true })
	createdAt?: Date

	@IsBoolean()
	@IsOptional()
	isCompleted: boolean

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({value}) => ('' + value).toLowerCase())
	priority: Priority
}
