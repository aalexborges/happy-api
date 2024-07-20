import { IsEmail, IsString, MinLength, ValidationError } from 'class-validator';
import { InsertEvent, UpdateEvent } from 'typeorm';

import { DatabaseSubscriber } from './database.subscriber';

describe('DatabaseSubscriber', () => {
  const subscriber = new DatabaseSubscriber();

  describe('.beforeInsert', () => {
    describe('validates the data', () => {
      class User {
        @IsEmail()
        email: string;
      }

      describe('with invalid data', () => {
        it('throws an error', async () => {
          expect.assertions(1);

          const entity = new User();
          const event = <InsertEvent<any>>{ entity };

          try {
            await subscriber.beforeInsert(event);
          } catch (err) {
            expect(err).toEqual([
              <ValidationError>{
                children: [],
                constraints: { isEmail: expect.any(String) },
                property: 'email',
                target: entity,
                value: undefined,
              },
            ]);
          }
        });
      });

      describe('with valid data', () => {
        it('does not throw an error', async () => {
          const event = <InsertEvent<any>>{ entity: Object.assign(new User(), { email: 'email@email.com' }) };
          await expect(subscriber.beforeInsert(event)).resolves.toBeUndefined();
        });
      });
    });
  });

  describe('.beforeUpdate', () => {
    describe('validates the data', () => {
      class User {
        @IsEmail()
        email: string;

        @IsString()
        @MinLength(8)
        password: string;
      }

      describe('with invalid data', () => {
        it('throws an error', async () => {
          expect.assertions(1);

          const entity = Object.assign(new User(), { email: '' });
          const event = <UpdateEvent<any>>{ entity: <any>entity };

          try {
            await subscriber.beforeUpdate(event);
          } catch (err) {
            expect(err).toEqual([
              <ValidationError>{
                children: [],
                constraints: { isEmail: expect.any(String) },
                property: 'email',
                target: entity,
                value: '',
              },
            ]);
          }
        });
      });

      describe('with valid data', () => {
        it('does not throw an error', async () => {
          const event = <UpdateEvent<any>>{
            entity: <any>Object.assign(new User(), { email: 'email@email.com', password: null }),
          };
          await expect(subscriber.beforeUpdate(event)).resolves.toBeUndefined();
        });
      });
    });
  });
});
