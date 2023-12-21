import { Test, TestingModule } from '@nestjs/testing';
import { EasyService } from './easy.service';

describe('EasyService', () => {
  let service: EasyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EasyService],
    }).compile();

    service = module.get<EasyService>(EasyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
