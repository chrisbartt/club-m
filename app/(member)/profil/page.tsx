import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getMemberProfile } from '@/domains/members/profile-queries'
import { TIER_LABELS } from '@/lib/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from '@/components/member/profile-form'
import { PasswordForm } from '@/components/member/password-form'

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await getMemberProfile(session.user.id)
  if (!profile) redirect('/')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{profile.user.email}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {TIER_LABELS[profile.tier]}
          </span>
        </div>
      </div>

      <Tabs defaultValue="informations">
        <TabsList>
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="mot-de-passe">Mot de passe</TabsTrigger>
        </TabsList>

        <TabsContent value="informations" className="mt-4">
          <ProfileForm
            defaultValues={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              phone: profile.phone,
              bio: profile.bio,
              avatar: profile.avatar,
            }}
          />
        </TabsContent>

        <TabsContent value="mot-de-passe" className="mt-4">
          <PasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
