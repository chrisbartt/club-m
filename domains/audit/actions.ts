'use server'

import { db } from '@/lib/db'
import type { CreateAuditLogInput } from './types'

export async function createAuditLog(input: CreateAuditLogInput) {
  return db.auditLog.create({
    data: {
      userId: input.userId,
      userEmail: input.userEmail,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      details: input.details ?? undefined,
    },
  })
}
