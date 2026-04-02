'use client'

import { MessageCircle } from 'lucide-react'

interface ServiceContactButtonProps {
  serviceName: string
  whatsapp?: string | null
  phone?: string | null
  hasPrice: boolean
}

export default function ServiceContactButton({
  serviceName,
  whatsapp,
  phone,
  hasPrice,
}: ServiceContactButtonProps) {
  const contactNumber = whatsapp ?? phone
  const whatsappLink = contactNumber
    ? `https://wa.me/${contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Bonjour, je suis interesse(e) par votre service "${serviceName}" sur Club M.`,
      )}`
    : null

  const label = hasPrice ? 'Reserver' : 'Demander un devis'

  if (whatsappLink) {
    return (
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        {label}
      </a>
    )
  }

  return (
    <button
      disabled
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-50 text-gray-400 cursor-not-allowed"
    >
      <MessageCircle className="w-4 h-4" />
      Contacter
    </button>
  )
}
