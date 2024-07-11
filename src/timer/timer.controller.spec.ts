import { Test, TestingModule } from '@nestjs/testing';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { TimerDto } from './dto/timer.dto';
import { Priority } from '@prisma/client';

describe('TimerController', () => {
  let controller: TimerController;
  let service: TimerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimerController],
      providers: [
        {
          provide: TimerService,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TimerController>(TimerController);
    service = module.get<TimerService>(TimerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of tasks', async () => {
      const result = [{
        id: 'task1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Test task',
        priority: Priority.low,
        isCompleted: false,
        userId: 'user1'
      }];
      jest.spyOn(service, 'getAll').mockResolvedValue(result);

      expect(await controller.getAll('user1')).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      const taskDto: TimerDto = {
        name: 'Test task',
        priority: Priority.low,
        isCompleted: false,
      };
      const result = {
        id: 'task1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...taskDto,
        userId: 'user1'
      };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(taskDto, 'user1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskDto: TimerDto = {
        name: 'Updated task',
        priority: Priority.low,
        isCompleted: false,
      };
      const result = {
        id: 'task1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...taskDto,
        userId: 'user1'
      };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(taskDto, 'user1', 'task1')).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const result = {
        id: 'task1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Test task',
        priority: Priority.low,
        isCompleted: false,
        userId: 'user1'
      };
      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.delete('task1', result.userId)).toBe(result);
    });
  });
});
