import { Test, TestingModule } from '@nestjs/testing';
import { EmailProcessMapperService } from './email-process-mapper.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

describe('EmailProcessMapperService', () => {
  let service: EmailProcessMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailProcessMapperService],
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
    }).compile();

    service = module.get<EmailProcessMapperService>(EmailProcessMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
