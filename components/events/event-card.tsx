import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { EventPrice, EventAccessLevel, Currency } from '@/lib/generated/prisma/client'

const ACCESS_LEVEL_CONFIG: Record<
  EventAccessLevel,
  { label: string; className: string }
> = {
  PUBLIC: { label: 'Public', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  MEMBERS_ONLY: { label: 'Membres', className: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  PREMIUM_ONLY: { label: 'Premium', className: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  BUSINESS_ONLY: { label: 'Business', className: 'bg-amber-500/10 text-amber-600 border-amber-200' },
}

function formatDateFr(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(new Date(date))
    .replace(':', 'h')
}

function getLowestPrice(prices: EventPrice[]): { price: number; currency: Currency } | null {
  if (prices.length === 0) return null
  const sorted = [...prices].sort((a, b) => Number(a.price) - Number(b.price))
  return { price: Number(sorted[0].price), currency: sorted[0].currency }
}

function getInitials(title: string): string {
  return title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

type EventCardProps = {
  event: {
    id: string
    title: string
    slug: string
    coverImage: string | null
    startDate: Date
    endDate: Date
    location: string
    accessLevel: EventAccessLevel
    prices: EventPrice[]
    _count: { tickets: number }
  }
  href?: string
}

export function EventCard({ event, href }: EventCardProps) {
  const link = href ?? `/evenements/${event.slug}`
  const accessConfig = ACCESS_LEVEL_CONFIG[event.accessLevel]
  const lowestPrice = getLowestPrice(event.prices)

  return (
    <Link href={link} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md py-0 gap-0">
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-3xl font-bold text-primary/40">
                {getInitials(event.title)}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className={accessConfig.className}>
              {accessConfig.label}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="space-y-2 p-4">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {formatDateFr(event.startDate)}
          </p>

          <p className="text-sm text-muted-foreground truncate">
            {event.location}
          </p>

          {lowestPrice && (
            <p className="text-sm font-medium text-primary">
              A partir de {lowestPrice.price}
              {CURRENCY_SYMBOLS[lowestPrice.currency]}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
