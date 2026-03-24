import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getProfileBySlug } from '@/domains/directory/queries'
import { Badge } from '@/components/ui/badge'
import { TIER_LABELS } from '@/lib/constants'
import { MiniBoutique } from '@/components/directory/mini-boutique'
import { ArrowLeft, Phone, Mail, Globe, MessageCircle, MapPin } from 'lucide-react'
import type { MemberTier } from '@/lib/generated/prisma/client'

export default async function AnnuaireProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)

  if (!profile || !profile.isPublished || !profile.isApproved) {
    redirect('/annuaire')
  }

  const memberName = `${profile.member.firstName} ${profile.member.lastName}`
  const isVerified = profile.member.verificationStatus === 'VERIFIED'
  const activeProducts = profile.products.filter((p) => p.isActive)

  const contactFields = [
    { icon: Phone, label: 'Telephone', value: profile.phone },
    { icon: Mail, label: 'Email', value: profile.email },
    { icon: Globe, label: 'Site web', value: profile.website, isLink: true },
    { icon: MessageCircle, label: 'WhatsApp', value: profile.whatsapp },
    { icon: MapPin, label: 'Adresse', value: profile.address },
  ].filter((f) => f.value)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/annuaire"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour a l&apos;annuaire
      </Link>

      {/* Cover */}
      {profile.coverImage ? (
        <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-xl">
          <Image
            src={profile.coverImage}
            alt={profile.businessName}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      ) : (
        <div className="mb-8 flex aspect-[21/9] items-center justify-center rounded-xl bg-primary/10">
          <span className="text-5xl font-bold text-primary/40">
            {profile.businessName
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 3)
              .toUpperCase()}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{profile.businessName}</h1>
          <Badge variant="secondary">{profile.category}</Badge>
        </div>
        <p className="text-muted-foreground leading-relaxed">{profile.description}</p>
      </div>

      {/* Contact */}
      {contactFields.length > 0 && (
        <section className="mb-8 rounded-lg border p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          {contactFields.map((field) => {
            const Icon = field.icon
            return (
              <div key={field.label} className="flex items-center gap-3 text-sm">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground w-24 shrink-0">{field.label}</span>
                {field.isLink && field.value ? (
                  <a
                    href={field.value.startsWith('http') ? field.value : `https://${field.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate"
                  >
                    {field.value}
                  </a>
                ) : (
                  <span className="truncate">{field.value}</span>
                )}
              </div>
            )
          })}
        </section>
      )}

      {/* Member */}
      <section className="mb-8 rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-3">Entrepreneure</h2>
        <div className="flex items-center gap-3">
          {profile.member.avatar ? (
            <Image
              src={profile.member.avatar}
              alt={memberName}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
              {profile.member.firstName[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{memberName}</span>
              {isVerified && (
                <Badge variant="default" className="text-xs">
                  Verifiee
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="mt-1 text-xs">
              {TIER_LABELS[profile.member.tier as MemberTier]}
            </Badge>
          </div>
        </div>
      </section>

      {/* Mini-boutique or showcase message */}
      {profile.profileType === 'STORE' && activeProducts.length > 0 && (
        <MiniBoutique products={activeProducts} />
      )}

      {profile.profileType === 'SHOWCASE' && (
        <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
          Cette entrepreneure presente son activite sur Club M
        </div>
      )}
    </div>
  )
}
