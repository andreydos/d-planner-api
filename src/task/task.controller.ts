import {
  Controller,
  Get,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus, Post, Param, Delete, Put
} from '@nestjs/common'
import { TaskService } from './task.service';
import { Auth } from '../auth/decorators/auth.decorator'
import { TaskDto } from './dto/task.dto'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('user/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.taskService.getAll(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post()
  @Auth()
  async create (@Body() dto: TaskDto, @CurrentUser('id') userId: string) {
    return this.taskService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @Auth()
  async update(@Body() dto: TaskDto,
               @CurrentUser('id') userId: string,
               @Param('id') id: string) {
    return this.taskService.update(dto, id, userId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async delete(@Param('id') id: string) {
    return this.taskService.delete(id)
  }
}
