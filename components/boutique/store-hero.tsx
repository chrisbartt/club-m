import { BadgeCheck, MapPin, Phone, Mail } from 'lucide-react'

interface StoreHeroProps {
  business: {
    businessName: string
    category: string
    coverImage: string | null
    address: string | null
    phone: string | null
    email: string | null
    whatsapp: string | null
    member: {
      firstName: string
      lastName: string
      avatar: string | null
    }
  }
}

export default function StoreHero({ business }: StoreHeroProps) {
  const whatsappLink = business.whatsapp
    ? `https://wa.me/${business.whatsapp.replace(/\D/g, '')}`
    : business.phone
      ? `https://wa.me/${business.phone.replace(/\D/g, '')}`
      : null

  return (
    <section className="relative">
      {/* Cover image */}
      <div className="relative h-56 md:h-72 lg:h-80 bg-gradient-to-br from-[#091626] to-[#1a3050]">
        {business.coverImage ? (
          <img
            src={business.coverImage}
            alt={business.businessName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#091626] to-[#1a3050] flex items-center justify-center">
            <span className="text-7xl md:text-9xl font-bold text-white/10">
              {business.businessName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative max-w-6xl mx-auto px-4 -mt-24 md:-mt-28">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
              {business.member.avatar ? (
                <img
                  src={business.member.avatar}
                  alt=""
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-[#a55b46] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {business.member.firstName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-[#091626] truncate">
                  {business.businessName}
                </h1>
                <BadgeCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-[#a55b46]/10 text-[#a55b46] rounded-full px-3 py-1 text-xs font-medium">
                  {business.category}
                </span>
                <span className="bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" />
                  Certifie Club M
                </span>
              </div>

              <p className="text-sm text-gray-500">
                {business.member.firstName} {business.member.lastName}
              </p>

              {business.address && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {business.address}
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-2 flex-shrink-0 w-full md:w-auto">
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20bd5a] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.305 0-4.461-.636-6.307-1.742l-.44-.264-3.116 1.044 1.044-3.116-.264-.44A9.953 9.953 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                  </svg>
                  Contacter sur WhatsApp
                </a>
              )}
              <div className="flex gap-2">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-[#091626] text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Appeler
                  </a>
                )}
                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-[#091626] text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
