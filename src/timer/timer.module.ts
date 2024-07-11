import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'
import { TaskService } from '../task/task.service'

@Module({
  controllers: [TimerController],
  providers: [TimerService, PrismaService, UserService, TaskService],
  exports: [TimerService],
})
export class TimerModule {}
