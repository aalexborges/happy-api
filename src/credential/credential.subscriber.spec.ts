import { InsertEvent, UpdateEvent } from 'typeorm';

import { AppException } from '@/exception/exception.model';

import { Credential } from './credential.entity';
import { CredentialSubscriber } from './credential.subscriber';

describe('CredentialSubscriber', () => {
  const subscriber = new CredentialSubscriber();

  describe('.listenTo', () => {
    it('returns Credential', () => {
      expect(subscriber.listenTo()).toEqual(Credential);
    });
  });

  describe('.beforeInsert', () => {
    describe('by password', () => {
      it('encrypts password', async () => {
        const password = '@Test123';
        const event = <InsertEvent<any>>{ entity: { password } };

        await expect(subscriber.beforeInsert(event)).resolves.toBeUndefined();
        expect(event.entity).toEqual({
          password,
          passwordDigest: expect.not.stringMatching(password),
        });
      });

      describe('with password confirmation', () => {
        describe('when the password and password confirmation match', () => {
          it('encrypts password', async () => {
            const password = '@Test123';
            const event = <InsertEvent<any>>{ entity: { password, passwordConfirmation: password } };

            await expect(subscriber.beforeInsert(event)).resolves.toBeUndefined();
            expect(event.entity).toEqual({
              password,
              passwordConfirmation: password,
              passwordDigest: expect.not.stringMatching(password),
            });
          });
        });

        describe('when the password and password confirmation do not match', () => {
          it('throws an AppException of type PASSWORDS_DO_NOT_MATCH', async () => {
            expect.assertions(2);

            try {
              const event = <InsertEvent<any>>{ entity: { password: '@Test123', passwordConfirmation: '@Diff4567' } };
              await subscriber.beforeInsert(event);
            } catch (err) {
              expect(err).toBeInstanceOf(AppException);
              expect(err).toEqual(new AppException('PASSWORDS_DO_NOT_MATCH'));
            }
          });
        });
      });
    });

    describe('by passwordDigest', () => {
      it('encrypts password', async () => {
        const password = '@Test123';
        const event = <InsertEvent<any>>{ entity: { passwordDigest: password } };

        await expect(subscriber.beforeInsert(event)).resolves.toBeUndefined();
        expect(event.entity).toEqual({ passwordDigest: expect.not.stringMatching(password) });
      });
    });

    describe('when the password or password digest is not provided', () => {
      it('does not encrypt the password', async () => {
        const event = <InsertEvent<any>>{ entity: {} };

        await expect(subscriber.beforeInsert(event)).resolves.toBeUndefined();
        expect(event.entity).toEqual({});
      });
    });
  });

  describe('.beforeUpdate', () => {
    describe('by password', () => {
      it('encrypts password', async () => {
        const password = '@Test123';
        const event = <UpdateEvent<any>>{ entity: <any>{ password }, updatedColumns: [] };

        await expect(subscriber.beforeUpdate(event)).resolves.toBeUndefined();
        expect(event.entity).toEqual({
          password,
          passwordDigest: expect.not.stringMatching(password),
        });
      });

      describe('with password confirmation', () => {
        describe('when the password and password confirmation match', () => {
          it('encrypts password', async () => {
            const password = '@Test123';
            const event = <UpdateEvent<any>>{
              entity: <any>{ password, passwordConfirmation: password },
              updatedColumns: [],
            };

            await expect(subscriber.beforeUpdate(event)).resolves.toBeUndefined();
            expect(event.entity).toEqual({
              password,
              passwordConfirmation: password,
              passwordDigest: expect.not.stringMatching(password),
            });
          });
        });

        describe('when the password and password confirmation do not match', () => {
          it('throws an AppException of type PASSWORDS_DO_NOT_MATCH', async () => {
            expect.assertions(2);

            try {
              const event = <UpdateEvent<any>>{
                entity: <any>{ password: '@Test123', passwordConfirmation: '@Diff4567' },
                updatedColumns: [],
              };

              await subscriber.beforeUpdate(event);
            } catch (err) {
              expect(err).toBeInstanceOf(AppException);
              expect(err).toEqual(new AppException('PASSWORDS_DO_NOT_MATCH'));
            }
          });
        });
      });
    });

    describe('by password digest', () => {
      it('encrypts password', async () => {
        const password = '@Test123';
        const event = <UpdateEvent<any>>{
          entity: <any>{ passwordDigest: password },
          updatedColumns: [{ propertyName: 'passwordDigest' }],
        };

        await expect(subscriber.beforeUpdate(event)).resolves.toBeUndefined();
        expect(event.entity).toEqual({ passwordDigest: expect.not.stringMatching(password) });
      });
    });

    describe('when the password or password digest is not provided', () => {
      it('does not encrypt the password', async () => {
        const event = <UpdateEvent<any>>{ entity: {}, updatedColumns: [] };

        await expect(subscriber.beforeUpdate(event)).resolves.toBeUndefined();
        expect(event.entity).toEqual({});
      });
    });
  });

  describe('.afterInsert', () => {
    it('deletes password and password confirmation values', () => {
      const password = '@Test123';
      const event = <InsertEvent<any>>{ entity: { password, passwordConfirmation: password } };

      expect(subscriber.afterInsert(event)).toBeUndefined();
      expect(event.entity).toEqual({});
    });
  });

  describe('.afterUpdate', () => {
    it('deletes password and password confirmation values', () => {
      const password = '@Test123';
      const event = <UpdateEvent<any>>{ entity: <any>{ password, passwordConfirmation: password } };

      expect(subscriber.afterUpdate(event)).toBeUndefined();
      expect(event.entity).toEqual({});
    });
  });
});
