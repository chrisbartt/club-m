export type CreateAuditLogInput = {
  userId: string
  userEmail: string
  action: string
  entity: string
  entityId: string
  details?: Record<string, string | number | boolean | null>
}
