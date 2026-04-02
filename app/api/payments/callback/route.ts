import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getPaymentProvider } from '@/integrations/payment'
import { createNotification } from '@/domains/notifications/actions'
import {
  sendOrderConfirmationBuyer,
  sendOrderNotificationSeller,
} from '@/lib/email'
import { formatOrderNumber } from '@/lib/server-utils'

/**
 * ARAKA redirects here after payment completion.
 * POST /api/payments/callback
 * Body: { systemReference, transactionStatus }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const provider = getPaymentProvider()
    const event = await provider.verifyWebhook(body, '')

    // Find the payment by providerRef
    const payment = await db.payment.findFirst({
      where: { providerRef: event.providerRef },
      include: {
        order: {
          include: {
            items: { include: { product: true } },
            member: { include: { user: true } },
            customer: { include: { user: true } },
            business: { include: { member: { include: { user: true } } } },
          },
        },
        ticket: {
          include: {
            event: true,
            member: { include: { user: true } },
            customer: { include: { user: true } },
          },
        },
      },
    })

    if (!payment) {
      console.error('[CALLBACK] Payment not found for providerRef:', event.providerRef)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Update payment status
    const newPaymentStatus = event.status === 'success' ? 'SUCCESS' : 'FAILED'
    await db.payment.update({
      where: { id: payment.id },
      data: { status: newPaymentStatus },
    })

    // Handle order payment
    if (payment.order) {
      const order = payment.order
      if (event.status === 'success') {
        await db.order.update({
          where: { id: order.id },
          data: { status: 'PAID' },
        })

        // Timeline entry
        try {
          await db.orderStatusHistory.create({
            data: { orderId: order.id, status: 'PAID' },
          })
        } catch (e) {
          console.error('Timeline entry failed:', e)
        }

        // Send emails + notifications
        const buyerUser = order.member?.user ?? order.customer?.user
        const buyerName = order.member?.firstName ?? order.customer?.firstName ?? 'Client'

        if (buyerUser) {
          try {
            await sendOrderConfirmationBuyer(buyerUser.email, buyerName, {
              number: formatOrderNumber(order.id),
              items: order.items.map((item) => ({
                name: item.product.name,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
              })),
              total: Number(order.totalAmount),
              currency: order.currency,
              confirmationCode: order.confirmationCode,
              businessName: order.business.businessName,
            })
          } catch (e) {
            console.error('Order confirmation email failed:', e)
          }

          await createNotification({
            userId: buyerUser.id,
            type: 'ORDER_CREATED',
            title: 'Commande confirmee',
            message: `Commande ${formatOrderNumber(order.id)} chez ${order.business.businessName} confirmee.`,
            link: '/achats/' + order.id,
          })
        }

        // Notify seller
        const sellerUser = order.business.member.user
        try {
          await sendOrderNotificationSeller(sellerUser.email, order.business.businessName, {
            number: formatOrderNumber(order.id),
            buyerName,
            items: order.items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              unitPrice: Number(item.unitPrice),
            })),
            total: Number(order.totalAmount),
            currency: order.currency,
          })
        } catch (e) {
          console.error('Seller notification email failed:', e)
        }

        await createNotification({
          userId: sellerUser.id,
          type: 'ORDER_RECEIVED',
          title: 'Nouvelle commande',
          message: `Nouvelle commande ${formatOrderNumber(order.id)} de ${buyerName}.`,
          link: '/mon-business/commandes/' + order.id,
        })

        // Redirect buyer to confirmation page
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        return NextResponse.redirect(`${baseUrl}/confirmation/${order.id}`)
      } else {
        // Payment failed
        await db.order.update({
          where: { id: order.id },
          data: { status: 'CANCELLED' },
        })

        try {
          await db.orderStatusHistory.create({
            data: { orderId: order.id, status: 'CANCELLED', note: 'Paiement echoue' },
          })
        } catch (e) {
          console.error('Timeline entry failed:', e)
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        return NextResponse.redirect(`${baseUrl}/checkout?error=payment_failed`)
      }
    }

    // Handle ticket payment
    if (payment.ticket) {
      const ticket = payment.ticket
      if (event.status === 'success') {
        await db.ticket.update({
          where: { id: ticket.id },
          data: { status: 'PAID' },
        })
      } else {
        await db.ticket.update({
          where: { id: ticket.id },
          data: { status: 'CANCELLED' },
        })
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('[CALLBACK] Error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
