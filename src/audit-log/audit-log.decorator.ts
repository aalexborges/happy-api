import { AUDIT_ENTITY } from './audit-log.constant';

export function AuditEntity() {
  return (target: unknown) => {
    Reflect.defineMetadata(AUDIT_ENTITY, true, target);
  };
}
