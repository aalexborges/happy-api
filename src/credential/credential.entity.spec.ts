import { genSalt, hash } from 'bcrypt';
import { BaseEntity } from 'typeorm';

import { Credential } from './credential.entity';

jest.mock('typeorm', () => {
  const originalModule = jest.requireActual('typeorm');

  class BaseEntity {
    static findOneOrFail = jest.fn();
  }

  return { ...originalModule, BaseEntity };
});

describe('Credential', () => {
  describe('.validate', () => {
    describe('when there is password digest', () => {
      describe('with valid password', () => {
        it('validates the password, returning true', async () => {
          const password = '@Test123';
          const passwordDigest = await hash(password, await genSalt());
          const credential = Object.assign(new Credential(), { passwordDigest });

          await expect(credential.authenticate(password)).resolves.toBe(true);
          expect(BaseEntity.findOneOrFail).not.toHaveBeenCalled();
        });
      });

      describe('with invalid password', () => {
        it('validates the password, returning false', async () => {
          const password = '@Test123';
          const passwordDigest = await hash(password, await genSalt());
          const credential = Object.assign(new Credential(), { passwordDigest });

          await expect(credential.authenticate('@Diff4567')).resolves.toBe(false);
          expect(BaseEntity.findOneOrFail).not.toHaveBeenCalled();
        });
      });
    });

    describe('when there is no password digest', () => {
      describe('with valid password', () => {
        it('gets the passwordDigest and validates the password, returning true', async () => {
          const password = '@Test123';
          const passwordDigest = await hash(password, await genSalt());
          const credential = Object.assign(new Credential(), { id: 1 });

          (BaseEntity.findOneOrFail as jest.Mock).mockResolvedValueOnce({ passwordDigest });

          await expect(credential.authenticate(password)).resolves.toBe(true);
          expect(BaseEntity.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 }, select: ['passwordDigest'] });
        });
      });

      describe('with invalid password', () => {
        it('gets the passwordDigest and validates the password, returning false', async () => {
          const password = '@Test123';
          const passwordDigest = await hash(password, await genSalt());
          const credential = Object.assign(new Credential(), { id: 1 });

          (BaseEntity.findOneOrFail as jest.Mock).mockResolvedValueOnce({ passwordDigest });

          await expect(credential.authenticate('@Diff4567')).resolves.toBe(false);
          expect(BaseEntity.findOneOrFail).toHaveBeenCalledWith({ where: { id: 1 }, select: ['passwordDigest'] });
        });
      });
    });
  });
});
