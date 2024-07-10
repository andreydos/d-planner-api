import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { Priority } from '@prisma/client';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
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
      const taskDto: TaskDto = {
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
      const taskDto: TaskDto = {
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

      expect(await controller.delete('task1')).toBe(result);
    });
  });
});
