import { validateOrReject } from 'class-validator';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class DatabaseSubscriber implements EntitySubscriberInterface {
  async beforeInsert(event: InsertEvent<any>) {
    await validateOrReject(event.entity);
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    await validateOrReject(event.entity, {
      skipMissingProperties: true,
      skipNullProperties: true,
      skipUndefinedProperties: true,
    });
  }
}
