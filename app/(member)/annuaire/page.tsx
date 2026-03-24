import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getPublicProfiles, getCategories } from '@/domains/directory/queries'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DirectoryFilters } from '@/components/directory/directory-filters'

export const metadata = {
  title: 'Annuaire des membres | Club M',
}

export default async function MemberAnnuairePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const params = await searchParams
  const [profiles, categories] = await Promise.all([
    getPublicProfiles({
      category: params.category,
      search: params.search,
    }),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Annuaire des membres</h1>
        <p className="text-muted-foreground">
          Decouvrez les entrepreneures de la communaute Club M
        </p>
      </div>

      <DirectoryFilters
        categories={categories}
        currentCategory={params.category}
        currentSearch={params.search}
      />

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Aucun profil trouve</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => {
            const memberName = `${profile.member.firstName} ${profile.member.lastName}`
            const description =
              profile.description.length > 120
                ? profile.description.slice(0, 120) + '...'
                : profile.description

            return (
              <Link
                key={profile.id}
                href={`/annuaire/${profile.slug}`}
                className="group block"
              >
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
                      <span className="text-3xl font-bold text-primary/60">
                        {profile.businessName
                          .split(' ')
                          .map((w) => w[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
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

                    {/* Member info — more visible for members */}
                    <div className="flex items-center gap-2 text-sm">
                      {profile.member.avatar ? (
                        <Image
                          src={profile.member.avatar}
                          alt={memberName}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {profile.member.firstName[0]}
                        </div>
                      )}
                      <span className="font-medium">{memberName}</span>
                    </div>

                    {profile.profileType === 'STORE' && profile._count.products > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {profile._count.products} produit{profile._count.products > 1 ? 's' : ''}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
