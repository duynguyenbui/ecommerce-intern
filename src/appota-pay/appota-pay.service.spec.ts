import { Test, TestingModule } from '@nestjs/testing';
import { AppotaPayService } from './appota-pay.service';

describe('AppotaPayService', () => {
  let service: AppotaPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppotaPayService],
    }).compile();

    service = module.get<AppotaPayService>(AppotaPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
