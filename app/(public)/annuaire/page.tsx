import Link from 'next/link'
import { getPublicProfiles, getCategories } from '@/domains/directory/queries'
import { BusinessCard } from '@/components/directory/business-card'
import { Button } from '@/components/ui/button'
import { DirectoryFilters } from '@/components/directory/directory-filters'

export const metadata = {
  title: 'Annuaire | Club M',
  description: 'Decouvrez les femmes entrepreneures de notre communaute',
}

export default async function AnnuairePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const [profiles, categories] = await Promise.all([
    getPublicProfiles({
      category: params.category,
      search: params.search,
    }),
    getCategories(),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Annuaire Club M</h1>
        <p className="text-muted-foreground">
          Decouvrez les femmes entrepreneures de notre communaute
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
          {profiles.map((profile) => (
            <BusinessCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold">
          Rejoignez Club M pour apparaitre dans l&apos;annuaire
        </h2>
        <p className="mb-4 text-muted-foreground">
          Creez votre fiche business et faites connaitre votre activite
        </p>
        <Button asChild>
          <Link href="/register">Rejoindre Club M</Link>
        </Button>
      </div>
    </div>
  )
}
