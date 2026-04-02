import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifie' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      member: {
        include: {
          kycVerifications: {
            orderBy: { submittedAt: 'desc' },
            take: 1,
          },
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { startDate: 'desc' },
          },
          businessProfile: { select: { category: true } },
        },
      },
    },
  })

  if (!user || !user.member) {
    return NextResponse.json({ error: 'Membre introuvable' }, { status: 404 })
  }

  const m = user.member
  const latestKyc = m.kycVerifications[0] ?? null

  const response = {
    user: {
      id: m.id,
      prenom: m.firstName,
      nom: m.lastName,
      email: user.email,
      telephone: m.phone ?? '',
      plan: m.tier,
      status: m.status,
      avatar: m.avatar,
      bio: m.bio,
      secteur: m.businessProfile?.category ?? null,
      ville: null,
      pays: null,
      siteWeb: null,
      instagram: null,
      linkedin: null,
      createdAt: m.createdAt.toISOString(),
      verification: latestKyc
        ? {
            aiResult: latestKyc.status,
            adminDecision: latestKyc.reviewedBy ? latestKyc.status : null,
            createdAt: latestKyc.submittedAt.toISOString(),
          }
        : null,
      subscriptions: m.subscriptions.map((s) => ({
        plan: s.tier,
        startsAt: s.startDate.toISOString(),
        expiresAt: s.endDate?.toISOString() ?? null,
        status: s.status,
      })),
    },
  }

  return NextResponse.json(response)
}
