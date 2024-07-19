import { InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { AuditEntity } from './audit-log.decorator';
import { AuditLog } from './audit-log.entity';
import { AuditLogSubscriber } from './audit-log.subscriber';

jest.mock('./audit-log.entity.ts', () => {
  return { AuditLog: { create: jest.fn(params => ({ ...params })) } };
});

describe('AuditLogSubscriber', () => {
  const subscriber = new AuditLogSubscriber();

  const manager = { save: jest.fn(), getId: jest.fn(() => 1) };

  @AuditEntity()
  class AuditTestEntity {
    data: string;
  }

  describe('.afterInsert', () => {
    describe('if the entity is auditable', () => {
      it('creates an audit log', async () => {
        const event = <InsertEvent<any>>{
          entity: Object.assign(new AuditTestEntity(), { data: 'test' }),
          manager: <any>manager,
          metadata: { name: AuditTestEntity.name },
        };

        await expect(subscriber.afterInsert(event)).resolves.toBeUndefined();
        expect(AuditLog.create).toHaveBeenCalled();
        expect(manager.save).toHaveBeenCalledWith({
          event: 'INSERT',
          itemId: 1,
          itemType: 'AuditTestEntity',
          object: { data: 'test' },
          objectChanges: null,
        });
      });
    });

    describe('if the entity is not auditable', () => {
      it('does not do anything', async () => {
        const event = <InsertEvent<any>>{ entity: new Error(), manager: <any>manager };

        await expect(subscriber.afterInsert(event)).resolves.toBeUndefined();
        expect(AuditLog.create).not.toHaveBeenCalled();
        expect(manager.save).not.toHaveBeenCalled();
      });
    });
  });

  describe('.afterUpdate', () => {
    describe('if the entity is auditable', () => {
      it('creates an audit log', async () => {
        const event = <UpdateEvent<any>>{
          entity: <any>{ data: 'update' },
          manager: <any>manager,
          metadata: { name: AuditTestEntity.name },
          databaseEntity: Object.assign(new AuditTestEntity(), { data: 'test' }),
          updatedColumns: [{ propertyName: 'data' }],
        };

        await expect(subscriber.afterUpdate(event)).resolves.toBeUndefined();
        expect(AuditLog.create).toHaveBeenCalled();
        expect(manager.save).toHaveBeenCalledWith({
          event: 'UPDATE',
          itemId: 1,
          itemType: 'AuditTestEntity',
          object: { data: 'update' },
          objectChanges: { data: ['test', 'update'] },
        });
      });
    });

    describe('if the entity is not auditable', () => {
      it('does not do anything', async () => {
        const event = <UpdateEvent<any>>{ databaseEntity: new Error(), manager: <any>manager };

        await expect(subscriber.afterUpdate(event)).resolves.toBeUndefined();
        expect(AuditLog.create).not.toHaveBeenCalled();
        expect(manager.save).not.toHaveBeenCalled();
      });
    });
  });

  describe('.afterRemove', () => {
    describe('if the entity is auditable', () => {
      it('creates an audit log', async () => {
        const event = <RemoveEvent<any>>{
          manager: <any>manager,
          metadata: { name: AuditTestEntity.name },
          databaseEntity: Object.assign(new AuditTestEntity(), { data: 'test' }),
        };

        await expect(subscriber.afterRemove(event)).resolves.toBeUndefined();
        expect(AuditLog.create).toHaveBeenCalled();
        expect(manager.save).toHaveBeenCalledWith({
          event: 'REMOVE',
          itemId: 1,
          itemType: 'AuditTestEntity',
          object: { data: 'test' },
          objectChanges: null,
        });
      });
    });

    describe('if the entity is not auditable', () => {
      it('does not do anything', async () => {
        const event = <RemoveEvent<any>>{ databaseEntity: new Error(), manager: <any>manager };

        await expect(subscriber.afterRemove(event)).resolves.toBeUndefined();
        expect(AuditLog.create).not.toHaveBeenCalled();
        expect(manager.save).not.toHaveBeenCalled();
      });
    });
  });
});
