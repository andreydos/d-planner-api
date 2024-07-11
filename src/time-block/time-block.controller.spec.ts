import { Test, TestingModule } from '@nestjs/testing';
import { TimeBlockController } from './time-block.controller';
import { TimeBlockService } from './time-block.service';

describe('TimeBlockController', () => {
  let controller: TimeBlockController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeBlockController],
      providers: [
        {
          provide: TimeBlockService,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TimeBlockController>(TimeBlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
