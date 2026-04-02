import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Test database connectivity
    await db.$queryRawUnsafe('SELECT 1')

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[HEALTH] Database check failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
      },
      { status: 503 },
    )
  }
}
