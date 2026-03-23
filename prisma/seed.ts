import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { hash } from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  const adminPassword = await hash('admin123', 12)
  const memberPassword = await hash('member123', 12)
  const customerPassword = await hash('customer123', 12)

  // Admin
  const admin = await db.user.upsert({
    where: { email: 'admin@clubm.cd' },
    update: {},
    create: {
      email: 'admin@clubm.cd',
      passwordHash: adminPassword,
      emailVerified: true,
      adminAccount: { create: { role: 'SUPER_ADMIN' } },
    },
  })
  console.log(`Admin: admin@clubm.cd / admin123 (id: ${admin.id})`)

  // Member Free
  const freeMember = await db.user.upsert({
    where: { email: 'free@clubm.cd' },
    update: {},
    create: {
      email: 'free@clubm.cd',
      passwordHash: memberPassword,
      emailVerified: true,
      member: {
        create: {
          firstName: 'Marie',
          lastName: 'Kabila',
          tier: 'FREE',
          verificationStatus: 'DECLARED',
        },
      },
    },
  })
  console.log(`Free member: free@clubm.cd / member123 (id: ${freeMember.id})`)

  // Member Premium (verified)
  const premiumMember = await db.user.upsert({
    where: { email: 'premium@clubm.cd' },
    update: {},
    create: {
      email: 'premium@clubm.cd',
      passwordHash: memberPassword,
      emailVerified: true,
      member: {
        create: {
          firstName: 'Sarah',
          lastName: 'Lumumba',
          tier: 'PREMIUM',
          verificationStatus: 'VERIFIED',
          businessProfile: {
            create: {
              businessName: 'Sarah Consulting',
              slug: 'sarah-consulting',
              description: 'Conseil en strategie pour entreprises',
              category: 'Conseil',
              profileType: 'SHOWCASE',
              isPublished: true,
              isApproved: true,
            },
          },
        },
      },
    },
  })
  console.log(`Premium member: premium@clubm.cd / member123 (id: ${premiumMember.id})`)

  // Member Business (verified)
  const businessMember = await db.user.upsert({
    where: { email: 'business@clubm.cd' },
    update: {},
    create: {
      email: 'business@clubm.cd',
      passwordHash: memberPassword,
      emailVerified: true,
      member: {
        create: {
          firstName: 'Grace',
          lastName: 'Mwamba',
          tier: 'BUSINESS',
          verificationStatus: 'VERIFIED',
          businessProfile: {
            create: {
              businessName: 'Grace Fashion',
              slug: 'grace-fashion',
              description: 'Mode et accessoires pour femmes',
              category: 'Mode',
              profileType: 'STORE',
              isPublished: true,
              isApproved: true,
            },
          },
        },
      },
    },
  })
  console.log(`Business member: business@clubm.cd / member123 (id: ${businessMember.id})`)

  // Customer
  const customer = await db.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      passwordHash: customerPassword,
      emailVerified: true,
      customer: {
        create: {
          firstName: 'Jean',
          lastName: 'Mukendi',
          phone: '+243812345678',
        },
      },
    },
  })
  console.log(`Customer: client@example.com / customer123 (id: ${customer.id})`)

  console.log('\nSeeding complete! 5 users created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    pool.end()
    db.$disconnect()
  })
