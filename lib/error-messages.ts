type ErrorUxEntry = {
  message: string
  severity: 'info' | 'warning' | 'error'
  action?: { label: string; href: string }
}

export const ERROR_UX_MAP: Record<string, ErrorUxEntry> = {
  NOT_AUTHENTICATED: {
    message: 'Vous devez vous connecter pour continuer.',
    severity: 'warning',
    action: { label: 'Se connecter', href: '/login' },
  },
  ACCOUNT_SUSPENDED: {
    message: 'Votre compte a ete suspendu. Contactez le support.',
    severity: 'error',
    action: { label: 'Contacter le support', href: '/contact' },
  },
  ACCOUNT_INACTIVE: {
    message: 'Votre compte est inactif.',
    severity: 'error',
  },
  NOT_A_MEMBER: {
    message: "Vous n'etes pas membre Club M.",
    severity: 'warning',
    action: { label: 'Rejoindre Club M', href: '/register' },
  },
  MEMBER_SUSPENDED: {
    message: 'Votre compte membre a ete suspendu.',
    severity: 'error',
    action: { label: 'Contacter le support', href: '/contact' },
  },
  INSUFFICIENT_TIER: {
    message: 'Cette fonctionnalite est reservee aux membres Premium.',
    severity: 'info',
    action: { label: 'Decouvrir Premium', href: '/upgrade' },
  },
  NOT_VERIFIED: {
    message: 'Votre profil doit etre verifie pour acceder a cette fonctionnalite.',
    severity: 'warning',
    action: { label: 'Verifier mon profil', href: '/kyc' },
  },
  NOT_ADMIN: {
    message: "Acces reserve aux administrateurs.",
    severity: 'error',
  },
  INSUFFICIENT_ADMIN_ROLE: {
    message: "Droits d'administration insuffisants.",
    severity: 'error',
  },
  NOT_OWNER: {
    message: "Vous n'avez pas acces a cette ressource.",
    severity: 'error',
  },
  RESOURCE_NOT_FOUND: {
    message: 'Ressource introuvable.',
    severity: 'error',
  },
  NO_STORE_PROFILE: {
    message: "Vous devez avoir un profil Business pour vendre.",
    severity: 'warning',
    action: { label: 'Passer Business', href: '/upgrade' },
  },
  PROFILE_NOT_APPROVED: {
    message: "Votre profil business est en attente de validation.",
    severity: 'info',
  },
  EVENT_FULL: {
    message: "L'evenement est complet.",
    severity: 'warning',
  },
  EVENT_NOT_BOOKABLE: {
    message: "Cet evenement n'est pas disponible a la reservation.",
    severity: 'warning',
  },
  CONFIRMATION_CODE_EXPIRED: {
    message: 'Le code de confirmation a expire. Contactez le support.',
    severity: 'error',
    action: { label: 'Contacter le support', href: '/contact' },
  },
  CONFIRMATION_CODE_INVALID: {
    message: 'Le code de confirmation est incorrect.',
    severity: 'error',
  },
  INSUFFICIENT_STOCK: {
    message: 'Stock insuffisant pour ce produit.',
    severity: 'warning',
  },
  PRODUCT_INACTIVE: {
    message: 'Ce produit est indisponible.',
    severity: 'warning',
  },
  KYC_ALREADY_PENDING: {
    message: 'Une verification est deja en cours.',
    severity: 'info',
  },
  SUBSCRIPTION_ALREADY_ACTIVE: {
    message: 'Vous avez deja un abonnement actif.',
    severity: 'info',
  },
  UPGRADE_IN_PROGRESS: {
    message: 'Un upgrade est deja en cours.',
    severity: 'info',
  },
  ORDER_ALREADY_CONFIRMED: {
    message: 'Cette commande a deja ete confirmee.',
    severity: 'info',
  },
}

export function getErrorUx(code: string): ErrorUxEntry {
  return (
    ERROR_UX_MAP[code] ?? {
      message: 'Une erreur est survenue. Veuillez reessayer.',
      severity: 'error' as const,
    }
  )
}
