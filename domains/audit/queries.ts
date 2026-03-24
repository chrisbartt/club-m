import { db } from '@/lib/db'

export async function getAuditLogs(filters?: { entity?: string; limit?: number }) {
  return db.auditLog.findMany({
    where: filters?.entity ? { entity: filters.entity } : undefined,
    orderBy: { createdAt: 'desc' },
    take: filters?.limit ?? 100,
  })
}

export async function getAuditLogEntities(): Promise<string[]> {
  const results = await db.auditLog.findMany({
    select: { entity: true },
    distinct: ['entity'],
    orderBy: { entity: 'asc' },
  })
  return results.map((r) => r.entity)
}
