import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseModule } from '@/database/database.module';

import { HealthController } from './health.controller';
import { HealthModule } from './health.module';

describe('HealthController', () => {
  let controller: HealthController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule, HealthModule],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('.check', () => {
    it('returns an object with the application status', async () => {
      await expect(controller.check()).resolves.toEqual({
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } },
      });
    });
  });
});
