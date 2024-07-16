import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { DatabaseModule } from '@/database/database.module';
import { HealthModule } from '@/health/health.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HealthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('returns a JSON/Object with information about the application status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect(res =>
          expect(res.body).toEqual(
            expect.objectContaining({
              status: 'ok',
              details: { database: { status: 'up' } },
              error: {},
              info: { database: { status: 'up' } },
            }),
          ),
        );
    });
  });
});
