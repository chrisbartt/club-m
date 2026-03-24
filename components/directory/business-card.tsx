import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { PublicProfileListItem } from '@/domains/directory/types'

interface BusinessCardProps {
  profile: PublicProfileListItem
}

export function BusinessCard({ profile }: BusinessCardProps) {
  const memberName = `${profile.member.firstName} ${profile.member.lastName}`
  const initials = profile.businessName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const description =
    profile.description.length > 100
      ? profile.description.slice(0, 100) + '...'
      : profile.description

  return (
    <Link href={`/annuaire/${profile.slug}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {profile.coverImage ? (
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={profile.coverImage}
              alt={profile.businessName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-primary/10">
            <span className="text-3xl font-bold text-primary/60">{initials}</span>
          </div>
        )}

        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold leading-tight group-hover:text-primary transition-colors">
              {profile.businessName}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {profile.category}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {profile.member.avatar ? (
                <Image
                  src={profile.member.avatar}
                  alt={memberName}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
                  {profile.member.firstName[0]}
                </div>
              )}
              <span>{memberName}</span>
            </div>

            {profile.profileType === 'STORE' && profile._count.products > 0 && (
              <span>{profile._count.products} produit{profile._count.products > 1 ? 's' : ''}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
