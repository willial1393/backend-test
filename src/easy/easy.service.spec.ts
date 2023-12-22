import { Test, TestingModule } from '@nestjs/testing';
import { EasyService } from './easy.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

describe('EasyService', () => {
  let service: EasyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EasyService],
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    }).compile();

    service = module.get<EasyService>(EasyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
