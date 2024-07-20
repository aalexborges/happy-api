import { genSalt, hash } from 'bcrypt';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { AppException } from '@/exception/exception.model';

import { Credential } from './credential.entity';

@EventSubscriber()
export class CredentialSubscriber implements EntitySubscriberInterface<Credential> {
  listenTo() {
    return Credential;
  }

  async beforeInsert({ entity }: InsertEvent<Credential>) {
    if (!entity.password && !entity.passwordDigest) return;
    if (entity.passwordConfirmation && entity.password !== entity.passwordConfirmation) {
      throw new AppException('PASSWORDS_DO_NOT_MATCH');
    }

    entity.passwordDigest = await hash(entity.password || entity.passwordDigest, await genSalt());
  }

  async beforeUpdate({ entity, updatedColumns }: UpdateEvent<Credential>) {
    if (!entity.password && !updatedColumns.some(({ propertyName }) => propertyName === 'passwordDigest')) return;

    const password = entity.password || entity.passwordDigest;
    if (password && entity.passwordConfirmation && password !== entity.passwordConfirmation) {
      throw new AppException('PASSWORDS_DO_NOT_MATCH');
    }

    entity.passwordDigest = await hash(password, await genSalt());
  }

  afterInsert({ entity }: InsertEvent<Credential>) {
    if (entity.password) delete entity.password;
    if (entity.passwordConfirmation) delete entity.passwordConfirmation;
  }

  afterUpdate({ entity }: UpdateEvent<Credential>) {
    if (entity.password) delete entity.password;
    if (entity.passwordConfirmation) delete entity.passwordConfirmation;
  }
}
