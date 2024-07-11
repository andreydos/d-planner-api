import {
  Controller,
  Get,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus, Post, Param, Delete, Put
} from '@nestjs/common'
import { TimerService } from './timer.service';
import { Auth } from '../auth/decorators/auth.decorator'
import { TimerRoundDto, TimerSessionDto } from './dto/timer.dto'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('user/timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get('today')
  @Auth()
  async getTodaySessions(@CurrentUser('id') userId: string) {
    return this.timerService.getTodaySession(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post()
  @Auth()
  async create (@CurrentUser('id') userId: string) {
    return this.timerService.create(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @Auth()
  async updateSession(@Body() dto: TimerSessionDto,
                    @CurrentUser('id') userId: string,
                    @Param('id') id: string) {
    return this.timerService.update(dto, id, userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Put('/round/:id')
  @Auth()
  async updateRound(@Body() dto: TimerRoundDto,
               @Param('id') id: string) {
    return this.timerService.updateRound(dto, id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  async deleteSession(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.timerService.deleteSession(id, userId)
  }
}
