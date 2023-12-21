import { Test, TestingModule } from '@nestjs/testing';
import { EmailProcessMapperService } from './email-process-mapper.service';

describe('EmailProcessMapperService', () => {
  let service: EmailProcessMapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailProcessMapperService],
    }).compile();

    service = module.get<EmailProcessMapperService>(EmailProcessMapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
