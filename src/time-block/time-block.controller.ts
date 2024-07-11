import {
  Controller,
  Get,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus, Post, Param, Delete, Put
} from '@nestjs/common'
import { TimeBlockService } from './time-block.service';
import { Auth } from '../auth/decorators/auth.decorator'
import { TimeBlockDto, TimeBlockUpdateDto } from './dto/time-block.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('user/time-blocks')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.timeBlockService.getAll(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post()
  @Auth()
  async create (@Body() dto: TimeBlockDto, @CurrentUser('id') userId: string) {
    return this.timeBlockService.create(dto, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Put('update-order')
  @Auth()
  async updateOrder(@Body() updateOrderDto: UpdateOrderDto,
               @CurrentUser('id') userId: string) {
    return this.timeBlockService.updateOrder(updateOrderDto.ids, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @Auth()
  async update(@Body() dto: TimeBlockUpdateDto,
               @CurrentUser('id') userId: string,
               @Param('id') id: string) {
    return this.timeBlockService.update(dto, id, userId)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string,) {
    return this.timeBlockService.delete(id, userId)
  }
}
