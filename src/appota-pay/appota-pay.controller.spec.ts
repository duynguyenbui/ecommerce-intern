import { Test, TestingModule } from '@nestjs/testing';
import { AppotaPayController } from './appota-pay.controller';

describe('AppotaPayController', () => {
  let controller: AppotaPayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppotaPayController],
    }).compile();

    controller = module.get<AppotaPayController>(AppotaPayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
