import { Test, TestingModule } from '@nestjs/testing';
import { EasyController } from './easy.controller';
import { EasyService } from './easy.service';

describe('EasyController', () => {
  let controller: EasyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EasyController],
      providers: [EasyService],
    }).compile();

    controller = module.get<EasyController>(EasyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
