import { Test, TestingModule } from '@nestjs/testing';
import { EasyController } from './easy.controller';
import { EasyService } from './easy.service';
import { EmailProcessMapperService } from './mappers/email-process-mapper/email-process-mapper.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

describe('EasyController', () => {
  let controller: EasyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EasyController],
      providers: [EasyService, EmailProcessMapperService],
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    }).compile();

    controller = module.get<EasyController>(EasyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
