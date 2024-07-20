import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { AUDIT_ENTITY } from './audit-log.constant';
import { AuditLog, AuditLogEvent } from './audit-log.entity';

@EventSubscriber()
export class AuditLogSubscriber implements EntitySubscriberInterface {
  async afterInsert(event: InsertEvent<any>) {
    await this.createAuditLog('INSERT', event);
  }

  async afterUpdate(event: UpdateEvent<any>) {
    await this.createAuditLog('UPDATE', event);
  }

  async afterRemove(event: RemoveEvent<any>) {
    await this.createAuditLog('REMOVE', event);
  }

  private async createAuditLog(action: AuditLogEvent, event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>) {
    const target = event['databaseEntity']?.constructor || event?.entity?.constructor;
    if (!target || !Reflect.getMetadata(AUDIT_ENTITY, target)) return;

    const auditLog = AuditLog.create({
      event: action,
      itemType: event.metadata.name,
      itemId: this.getId(event),
      object: action === 'REMOVE' ? event['databaseEntity'] : event?.entity,
      objectChanges: action === 'UPDATE' ? this.getChanges(event as UpdateEvent<any>) : null,
    });

    await event.manager.save(auditLog);
  }

  private getChanges(event: UpdateEvent<any>) {
    const changes = {};

    for (const column of event.updatedColumns) {
      // field: [old value, new value]
      changes[column.propertyName] = [event.databaseEntity[column.propertyName], event.entity[column.propertyName]];
    }

    return changes;
  }

  private getId(event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>) {
    const id = event.manager.getId(event['databaseEntity'] || event?.entity);
    return id || event?.entity?.id || event['databaseEntity']?.id;
  }
}
