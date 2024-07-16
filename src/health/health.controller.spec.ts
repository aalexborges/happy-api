import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from './health.controller';
import { HealthModule } from './health.module';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('.check', () => {
    it('returns an object with the application status', async () => {
      await expect(controller.check()).resolves.toEqual({
        status: 'ok',
        info: {},
        error: {},
        details: {},
      });
    });
  });
});
