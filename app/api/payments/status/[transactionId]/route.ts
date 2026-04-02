import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPaymentProvider } from '@/integrations/payment'

/**
 * Poll payment status during checkout.
 * GET /api/payments/status/[transactionId]
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
  }

  const { transactionId } = await params

  // First check our DB for the payment
  const payment = await db.payment.findFirst({
    where: { providerRef: transactionId },
    include: {
      order: { select: { id: true, status: true } },
      ticket: { select: { id: true, status: true } },
    },
  })

  if (!payment) {
    return NextResponse.json({ error: 'Paiement introuvable' }, { status: 404 })
  }

  // If already resolved in our DB, return immediately
  if (payment.status === 'SUCCESS') {
    return NextResponse.json({
      status: 'success',
      orderId: payment.order?.id ?? null,
      ticketId: payment.ticket?.id ?? null,
    })
  }

  if (payment.status === 'FAILED') {
    return NextResponse.json({ status: 'failed' })
  }

  // Otherwise poll ARAKA
  try {
    const provider = getPaymentProvider()
    const arakaStatus = await provider.getPaymentStatus(transactionId)

    if (arakaStatus === 'success') {
      // Update our DB
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCESS' },
      })

      if (payment.order) {
        await db.order.update({
          where: { id: payment.order.id },
          data: { status: 'PAID' },
        })
        try {
          await db.orderStatusHistory.create({
            data: { orderId: payment.order.id, status: 'PAID' },
          })
        } catch (e) {
          console.error('Timeline entry failed:', e)
        }
      }

      if (payment.ticket) {
        await db.ticket.update({
          where: { id: payment.ticket.id },
          data: { status: 'PAID' },
        })
      }

      return NextResponse.json({
        status: 'success',
        orderId: payment.order?.id ?? null,
        ticketId: payment.ticket?.id ?? null,
      })
    }

    if (arakaStatus === 'failed') {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      })

      if (payment.order) {
        await db.order.update({
          where: { id: payment.order.id },
          data: { status: 'CANCELLED' },
        })
      }

      return NextResponse.json({ status: 'failed' })
    }

    return NextResponse.json({ status: 'pending' })
  } catch (error) {
    console.error('[STATUS POLL] Error:', error)
    return NextResponse.json({ status: 'pending' })
  }
}
