import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { hash } from 'bcryptjs'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

// ==================== HELPERS ====================

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function randomDate(daysBack: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack))
  d.setHours(Math.floor(Math.random() * 12) + 8)
  d.setMinutes(Math.floor(Math.random() * 60))
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function randomPhone(): string {
  const prefixes = ['81', '82', '83', '84', '85', '89', '90', '97', '98', '99']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const number = Math.floor(Math.random() * 9000000 + 1000000)
  return `+243${prefix}${number}`
}

function futureDate(daysAhead: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  d.setHours(18, 0, 0, 0)
  return d
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

// ==================== CLEAN ====================

async function cleanDatabase() {
  console.log('  Cleaning existing data...')
  await db.payment.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.ticket.deleteMany()
  await db.eventPrice.deleteMany()
  await db.event.deleteMany()
  await db.product.deleteMany()
  await db.businessProfile.deleteMany()
  await db.kycVerification.deleteMany()
  await db.upgradeRequest.deleteMany()
  await db.subscription.deleteMany()
  await db.auditLog.deleteMany()
  await db.address.deleteMany()
  await db.member.deleteMany()
  await db.customer.deleteMany()
  await db.adminAccount.deleteMany()
  await db.user.deleteMany()
  console.log('  Done cleaning.')
}

// ==================== ADMIN ====================

async function createAdmin(passwordHash: string) {
  console.log('  Creating admin...')
  const user = await db.user.create({
    data: {
      email: 'admin@clubm.cd',
      passwordHash,
      emailVerified: true,
      adminAccount: { create: { role: 'SUPER_ADMIN' } },
    },
    include: { adminAccount: true },
  })
  console.log(`  Admin: admin@clubm.cd / admin123 (id: ${user.id})`)
  return user
}

// ==================== BUSINESS MEMBERS ====================

interface BusinessDef {
  firstName: string
  lastName: string
  email: string
  businessName: string
  category: string
  description: string
  phone: string
  whatsapp: string
  address: string
  products: { name: string; description: string; price: number; type: 'PHYSICAL' | 'SERVICE' }[]
}

const businessDefs: BusinessDef[] = [
  {
    firstName: 'Grace',
    lastName: 'Mwamba',
    email: 'grace@clubm.cd',
    businessName: 'Grace Fashion',
    category: 'Mode',
    description:
      'Creations de mode africaine contemporaine. Robes, sacs et accessoires faits main a Kinshasa avec des tissus wax premium.',
    phone: '+243851234567',
    whatsapp: '+243851234567',
    address: 'Avenue du Commerce 45, Gombe, Kinshasa',
    products: [
      {
        name: 'Robe Wax Kinshasa',
        description:
          'Robe longue en wax hollandais, coupe moderne et elegante. Tailles S a XXL disponibles.',
        price: 85,
        type: 'PHYSICAL',
      },
      {
        name: 'Sac en cuir artisanal',
        description:
          'Sac a main en cuir veritable fabrique par nos artisans. Bandouliere ajustable, doublure en tissu wax.',
        price: 120,
        type: 'PHYSICAL',
      },
      {
        name: 'Ensemble pagne moderne',
        description:
          'Ensemble jupe + haut en pagne africain, coupe contemporaine. Ideal pour le bureau ou les ceremonies.',
        price: 65,
        type: 'PHYSICAL',
      },
    ],
  },
  {
    firstName: 'Esther',
    lastName: 'Kabongo',
    email: 'esther@clubm.cd',
    businessName: 'Chez Esther Traiteur',
    category: 'Restauration',
    description:
      'Service traiteur premium pour evenements et livraison de lunch box. Cuisine congolaise et internationale.',
    phone: '+243891234567',
    whatsapp: '+243891234567',
    address: 'Avenue Kabasele 12, Limete, Kinshasa',
    products: [
      {
        name: 'Lunch box executive',
        description:
          'Repas complet: riz, poulet grille, legumes sautes, salade et dessert. Livraison au bureau.',
        price: 15,
        type: 'PHYSICAL',
      },
      {
        name: 'Gateau anniversaire',
        description:
          'Gateau personnalise 3 etages, decoration fondant, inscription au choix. Pour 20-30 personnes.',
        price: 75,
        type: 'PHYSICAL',
      },
      {
        name: 'Brochettes poulet',
        description:
          'Plateau de 20 brochettes de poulet marine aux epices, accompagnees de sauce pili-pili maison.',
        price: 25,
        type: 'PHYSICAL',
      },
    ],
  },
  {
    firstName: 'Ornella',
    lastName: 'Kiese',
    email: 'ornella@clubm.cd',
    businessName: 'Belle Ornella',
    category: 'Beaute',
    description:
      'Salon de beaute haut de gamme. Tresses, maquillage, perruques et soins capillaires pour femmes exigeantes.',
    phone: '+243821234567',
    whatsapp: '+243821234567',
    address: 'Avenue de la Paix 78, Ngaliema, Kinshasa',
    products: [
      {
        name: 'Tresse complete',
        description:
          'Tressage complet avec meches incluses. Styles: box braids, twist, cornrows. Duree: 3-5h.',
        price: 45,
        type: 'SERVICE',
      },
      {
        name: 'Maquillage soiree',
        description:
          'Maquillage professionnel pour soiree ou mariage. Produits premium, tenue longue duree.',
        price: 35,
        type: 'SERVICE',
      },
      {
        name: 'Perruque bresilienne',
        description:
          'Perruque en cheveux naturels bresiliens, longueur 20 pouces, lace frontale. Pose incluse.',
        price: 150,
        type: 'PHYSICAL',
      },
    ],
  },
  {
    firstName: 'Sarah',
    lastName: 'Lumumba',
    email: 'sarah@clubm.cd',
    businessName: 'Sarah Events',
    category: 'Evenementiel',
    description:
      'Organisation et decoration d\'evenements a Kinshasa. Mariages, anniversaires, conferences et soirees VIP.',
    phone: '+243901234567',
    whatsapp: '+243901234567',
    address: 'Boulevard du 30 Juin 120, Gombe, Kinshasa',
    products: [
      {
        name: 'Decoration mariage',
        description:
          'Decoration complete pour mariage: arche florale, centres de table, eclairage, draperie. Jusqu\'a 200 invites.',
        price: 500,
        type: 'SERVICE',
      },
      {
        name: 'Location chaises + nappes',
        description:
          'Pack 50 chaises chiavari + nappes blanches + housses. Livraison et installation incluses.',
        price: 120,
        type: 'SERVICE',
      },
      {
        name: 'Coordination jour J',
        description:
          'Coordination complete le jour de l\'evenement. Equipe de 3 personnes, 12h de service.',
        price: 200,
        type: 'SERVICE',
      },
    ],
  },
  {
    firstName: 'Christelle',
    lastName: 'Mbuyi',
    email: 'christelle@clubm.cd',
    businessName: 'Christi Cosmetics',
    category: 'Cosmetiques',
    description:
      'Cosmetiques naturels et soins de la peau adaptes aux peaux africaines. Produits bio sans hydroquinone.',
    phone: '+243971234567',
    whatsapp: '+243971234567',
    address: 'Avenue Kasa-Vubu 33, Kalamu, Kinshasa',
    products: [
      {
        name: 'Creme eclaircissante bio',
        description:
          'Creme unifiante a base de karite et vitamine C. Sans hydroquinone. Pot 200ml.',
        price: 28,
        type: 'PHYSICAL',
      },
      {
        name: 'Kit soin visage',
        description:
          'Kit complet: nettoyant, tonique, serum et creme hydratante. Pour peaux mixtes a grasses.',
        price: 55,
        type: 'PHYSICAL',
      },
      {
        name: 'Parfum femme oriental',
        description:
          'Eau de parfum 100ml, notes de oud, vanille et jasmin. Longue tenue 12h+.',
        price: 42,
        type: 'PHYSICAL',
      },
    ],
  },
]

async function createBusinesses(passwordHash: string) {
  console.log('  Creating business members...')

  const results: {
    memberId: string
    businessId: string
    products: { id: string; price: number; name: string }[]
  }[] = []

  for (const biz of businessDefs) {
    const user = await db.user.create({
      data: {
        email: biz.email,
        passwordHash,
        emailVerified: true,
        member: {
          create: {
            firstName: biz.firstName,
            lastName: biz.lastName,
            phone: biz.phone,
            tier: 'BUSINESS',
            verificationStatus: 'VERIFIED',
            businessProfile: {
              create: {
                businessName: biz.businessName,
                slug: generateSlug(biz.businessName),
                description: biz.description,
                category: biz.category,
                profileType: 'STORE',
                isPublished: true,
                isApproved: true,
                phone: biz.phone,
                whatsapp: biz.whatsapp,
                address: biz.address,
              },
            },
          },
        },
      },
      include: { member: { include: { businessProfile: true } } },
    })

    const member = user.member!
    const profile = member.businessProfile!

    const createdProducts: { id: string; price: number; name: string }[] = []

    for (const prod of biz.products) {
      const p = await db.product.create({
        data: {
          businessId: profile.id,
          name: prod.name,
          description: prod.description,
          price: prod.price,
          type: prod.type,
          isActive: true,
          stock: prod.type === 'PHYSICAL' ? Math.floor(Math.random() * 50) + 10 : null,
        },
      })
      createdProducts.push({ id: p.id, price: prod.price, name: prod.name })
    }

    results.push({
      memberId: member.id,
      businessId: profile.id,
      products: createdProducts,
    })

    console.log(
      `    ${biz.businessName} (${biz.email}) — ${createdProducts.length} products`
    )
  }

  return results
}

// ==================== FREE MEMBERS ====================

const freeMemberDefs = [
  { firstName: 'Fabiola', lastName: 'Tshisekedi', email: 'fabiola@example.com', commune: 'Gombe' },
  { firstName: 'Nadine', lastName: 'Lukusa', email: 'nadine@example.com', commune: 'Limete' },
  { firstName: 'Gloire', lastName: 'Mbemba', email: 'gloire@example.com', commune: 'Ngaliema' },
  { firstName: 'Esther', lastName: 'Kalala', email: 'esther.kalala@example.com', commune: 'Bandalungwa' },
  { firstName: 'Rachel', lastName: 'Mwanza', email: 'rachel@example.com', commune: 'Masina' },
]

async function createFreeMembers(passwordHash: string) {
  console.log('  Creating free members...')
  const members: { memberId: string; name: string }[] = []

  for (const m of freeMemberDefs) {
    const user = await db.user.create({
      data: {
        email: m.email,
        passwordHash,
        emailVerified: true,
        member: {
          create: {
            firstName: m.firstName,
            lastName: m.lastName,
            phone: randomPhone(),
            tier: 'FREE',
            verificationStatus: 'DECLARED',
          },
        },
      },
      include: { member: true },
    })
    members.push({ memberId: user.member!.id, name: `${m.firstName} ${m.lastName}` })
    console.log(`    ${m.firstName} ${m.lastName} (${m.email})`)
  }

  return members
}

// ==================== CUSTOMERS ====================

const customerDefs = [
  { firstName: 'Patrick', lastName: 'Kasongo', email: 'patrick.kasongo@example.com', commune: 'Gombe', street: 'Avenue des Aviateurs 15' },
  { firstName: 'Divine', lastName: 'Kabila', email: 'divine.kabila@example.com', commune: 'Barumbu', street: 'Rue Usoke 8' },
  { firstName: 'Jean-Pierre', lastName: 'Mukendi', email: 'jp.mukendi@example.com', commune: 'Lemba', street: 'Avenue de l\'Universite 42' },
  { firstName: 'Merveille', lastName: 'Tshiani', email: 'merveille.t@example.com', commune: 'Matete', street: 'Avenue Elengesa 19' },
  { firstName: 'Albert', lastName: 'Lufungula', email: 'albert.luf@example.com', commune: 'Kintambo', street: 'Avenue du Flambeau 7' },
  { firstName: 'Brigitte', lastName: 'Mutombo', email: 'brigitte.m@example.com', commune: 'Selembao', street: 'Rue Kikwit 25' },
  { firstName: 'Christian', lastName: 'Ndombe', email: 'christian.n@example.com', commune: 'Lingwala', street: 'Avenue Tombalbaye 31' },
  { firstName: 'Sylvie', lastName: 'Mbuyi', email: 'sylvie.mbuyi@example.com', commune: 'Kalamu', street: 'Avenue Kasa-Vubu 56' },
  { firstName: 'Fiston', lastName: 'Kapanga', email: 'fiston.k@example.com', commune: 'Ngiri-Ngiri', street: 'Rue Makelele 14' },
  { firstName: 'Grace', lastName: 'Bukasa', email: 'grace.bukasa@example.com', commune: 'Mont-Ngafula', street: 'Avenue de la Colline 3' },
]

async function createCustomers(passwordHash: string) {
  console.log('  Creating customers...')
  const customers: { customerId: string; name: string }[] = []

  for (const c of customerDefs) {
    const user = await db.user.create({
      data: {
        email: c.email,
        passwordHash,
        emailVerified: true,
        customer: {
          create: {
            firstName: c.firstName,
            lastName: c.lastName,
            phone: randomPhone(),
            address: {
              create: {
                street: c.street,
                commune: c.commune,
                city: 'Kinshasa',
                province: 'Kinshasa',
                country: 'CD',
              },
            },
          },
        },
      },
      include: { customer: true },
    })
    customers.push({ customerId: user.customer!.id, name: `${c.firstName} ${c.lastName}` })
    console.log(`    ${c.firstName} ${c.lastName} (${c.email})`)
  }

  return customers
}

// ==================== ORDERS ====================

type OrderStatusType = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED'

const statusDistribution: OrderStatusType[] = [
  // ~15 COMPLETED
  ...Array(15).fill('COMPLETED' as const),
  // ~10 DELIVERED
  ...Array(10).fill('DELIVERED' as const),
  // ~10 SHIPPED
  ...Array(10).fill('SHIPPED' as const),
  // ~8 PAID
  ...Array(8).fill('PAID' as const),
  // ~5 PENDING
  ...Array(5).fill('PENDING' as const),
  // ~2 CANCELLED
  ...Array(2).fill('CANCELLED' as const),
]

async function createOrders(
  businesses: { memberId: string; businessId: string; products: { id: string; price: number; name: string }[] }[],
  freeMembers: { memberId: string; name: string }[],
  customers: { customerId: string; name: string }[]
) {
  console.log('  Creating orders...')

  // Shuffle status distribution
  const statuses = [...statusDistribution].sort(() => Math.random() - 0.5)

  // Track used confirmation codes to avoid collisions
  const usedCodes = new Set<string>()

  let orderCount = 0

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i]
    const business = pick(businesses)
    const numItems = Math.floor(Math.random() * 3) + 1
    const selectedProducts = pickN(business.products, numItems)

    // Alternate between member and customer buyers
    const isMemberBuyer = Math.random() < 0.4
    let memberId: string | null = null
    let customerId: string | null = null

    if (isMemberBuyer) {
      memberId = pick(freeMembers).memberId
    } else {
      customerId = pick(customers).customerId
    }

    // Build items
    const items = selectedProducts.map((p) => ({
      productId: p.id,
      unitPrice: p.price,
      quantity: Math.floor(Math.random() * 3) + 1,
    }))

    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const commission = Math.round(totalAmount * 0.1 * 100) / 100

    // Generate unique code
    let code = randomCode()
    while (usedCodes.has(code)) code = randomCode()
    usedCodes.add(code)

    const createdAt = randomDate(60)
    const codeExpiresAt = new Date(createdAt)
    codeExpiresAt.setDate(codeExpiresAt.getDate() + 14)

    const codeUsed = status === 'COMPLETED' || status === 'DELIVERED'

    const order = await db.order.create({
      data: {
        memberId,
        customerId,
        businessId: business.businessId,
        totalAmount,
        commission,
        confirmationCode: code,
        codeExpiresAt,
        codeUsed,
        status,
        createdAt,
        items: {
          create: items,
        },
      },
    })

    // Create payment for non-CANCELLED orders
    if (status !== 'CANCELLED') {
      const paymentStatus = status === 'PENDING' ? 'PENDING' : 'SUCCESS'
      await db.payment.create({
        data: {
          amount: totalAmount,
          currency: 'USD',
          status: paymentStatus,
          provider: pick(['MOBILE_MONEY', 'LOCAL_FINTECH'] as const),
          providerRef: paymentStatus === 'SUCCESS' ? `PAY-${randomCode()}-${randomCode()}` : null,
          orderId: order.id,
          createdAt,
        },
      })
    }

    orderCount++
  }

  console.log(`    ${orderCount} orders created`)
}

// ==================== EVENTS ====================

async function createEvents(admin: { id: string }) {
  console.log('  Creating events...')

  const eventDefs = [
    {
      title: 'Lunch Business Women Kinshasa',
      description:
        'Un dejeuner networking mensuel pour les femmes entrepreneures de Kinshasa. Echangez, partagez vos experiences et developpez votre reseau dans une ambiance conviviale et professionnelle. Buffet inclus.',
      location: 'Hotel Memling, Boulevard du 30 Juin, Gombe',
      startDate: futureDate(7),
      endDate: (() => { const d = futureDate(7); d.setHours(21, 0, 0, 0); return d })(),
      capacity: 50,
      accessLevel: 'PUBLIC' as const,
      prices: { PUBLIC: 50, FREE: 40, PREMIUM: 25, BUSINESS: 15 },
    },
    {
      title: 'Masterclass E-commerce',
      description:
        'Apprenez a lancer et developper votre boutique en ligne. Strategie digitale, marketing sur les reseaux sociaux, logistique et paiements en RDC. Formation pratique avec exercices.',
      location: 'Espace Texaf, Avenue Colonel Mondjiba, Lingwala',
      startDate: futureDate(14),
      endDate: (() => { const d = futureDate(14); d.setHours(21, 0, 0, 0); return d })(),
      capacity: 30,
      accessLevel: 'MEMBERS_ONLY' as const,
      prices: { PUBLIC: 80, FREE: 60, PREMIUM: 35, BUSINESS: 20 },
    },
    {
      title: 'Soiree Networking Premium',
      description:
        'Une soiree exclusive pour les membres Premium et Business du Club M. Cocktails, presentations de projets et opportunites de partenariat. Dress code: tenue de soiree.',
      location: 'Cercle de Kinshasa, Avenue des Aviateurs, Gombe',
      startDate: futureDate(21),
      endDate: (() => { const d = futureDate(21); d.setHours(23, 0, 0, 0); return d })(),
      capacity: 100,
      accessLevel: 'PREMIUM_ONLY' as const,
      prices: { PUBLIC: 100, FREE: 80, PREMIUM: 40, BUSINESS: 25 },
    },
  ]

  const events: { id: string; title: string }[] = []

  for (const ev of eventDefs) {
    const event = await db.event.create({
      data: {
        title: ev.title,
        slug: generateSlug(ev.title),
        description: ev.description,
        location: ev.location,
        startDate: ev.startDate,
        endDate: ev.endDate,
        capacity: ev.capacity,
        accessLevel: ev.accessLevel,
        status: 'PUBLISHED',
        createdById: admin.id,
        prices: {
          create: [
            { targetRole: 'PUBLIC', price: ev.prices.PUBLIC },
            { targetRole: 'FREE', price: ev.prices.FREE },
            { targetRole: 'PREMIUM', price: ev.prices.PREMIUM },
            { targetRole: 'BUSINESS', price: ev.prices.BUSINESS },
          ],
        },
      },
    })
    events.push({ id: event.id, title: event.title })
    console.log(`    ${ev.title}`)
  }

  return events
}

// ==================== TICKETS ====================

async function createTickets(
  freeMembers: { memberId: string; name: string }[],
  events: { id: string; title: string }[]
) {
  console.log('  Creating tickets...')

  // 10 tickets: spread across members and events
  const ticketAssignments = [
    { memberIdx: 0, eventIdx: 0 },
    { memberIdx: 1, eventIdx: 0 },
    { memberIdx: 2, eventIdx: 0 },
    { memberIdx: 3, eventIdx: 0 },
    { memberIdx: 4, eventIdx: 0 },
    { memberIdx: 0, eventIdx: 1 },
    { memberIdx: 1, eventIdx: 1 },
    { memberIdx: 2, eventIdx: 1 },
    { memberIdx: 3, eventIdx: 2 },
    { memberIdx: 4, eventIdx: 2 },
  ]

  let ticketCount = 0
  for (const ta of ticketAssignments) {
    const member = freeMembers[ta.memberIdx]
    const event = events[ta.eventIdx]
    const qrCode = `TKT-${randomCode()}-${randomCode()}`

    const ticket = await db.ticket.create({
      data: {
        eventId: event.id,
        memberId: member.memberId,
        qrCode,
        status: 'PAID',
      },
    })

    // Create payment for ticket
    await db.payment.create({
      data: {
        amount: 40, // FREE tier price
        currency: 'USD',
        status: 'SUCCESS',
        provider: 'MOBILE_MONEY',
        providerRef: `PAY-${randomCode()}-${randomCode()}`,
        ticketId: ticket.id,
      },
    })

    ticketCount++
  }

  console.log(`    ${ticketCount} tickets created`)
}

// ==================== MAIN ====================

async function main() {
  console.log('🌱 Seeding Club M database...\n')

  // 1. Clean
  await cleanDatabase()

  // 2. Hash password once
  const passwordHash = await hash('member123', 12)
  const adminPasswordHash = await hash('admin123', 12)

  // 3. Admin
  const admin = await createAdmin(adminPasswordHash)

  // 4. Business members + profiles + products
  const businesses = await createBusinesses(passwordHash)

  // 5. Free members
  const freeMembers = await createFreeMembers(passwordHash)

  // 6. Customers
  const customers = await createCustomers(passwordHash)

  // 7. Orders (~50)
  await createOrders(businesses, freeMembers, customers)

  // 8. Events
  const events = await createEvents(admin)

  // 9. Tickets
  await createTickets(freeMembers, events)

  console.log('\n✅ Seeding complete!')
  console.log('   - 1 admin (admin@clubm.cd / admin123)')
  console.log('   - 5 business members (member123)')
  console.log('   - 5 free members (member123)')
  console.log('   - 10 customers (member123)')
  console.log('   - 15 products')
  console.log('   - ~50 orders')
  console.log('   - 3 events')
  console.log('   - 10 tickets')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
    await pool.end()
  })
