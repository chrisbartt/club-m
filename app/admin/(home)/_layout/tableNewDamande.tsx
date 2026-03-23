"use client";

import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  Loader2,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  UserX,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Types basés sur le schema Prisma
type UserStatus =
  | "PENDING_VERIFICATION"
  | "PENDING_AI_REVIEW"
  | "PENDING_MANUAL_REVIEW"
  | "ACTIVE"
  | "REFUSED"
  | "SUSPENDED";

interface Membre {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  plan: string;
  status: UserStatus;
  avatar: string | null;
  secteur: string | null;
  ville: string | null;
  pays: string | null;
  createdAt: string;
  verification: {
    aiResult: string;
    adminDecision: string | null;
    createdAt: string;
  } | null;
}

// Couleurs d'avatar aléatoires basées sur les initiales
const avatarColors = [
  "bg-bgSidebar dark:bg-[#222529]",
  "bg-cyan-600",
  "bg-emerald-600",
  "bg-amber-500",
  "bg-violet-600",
  "bg-rose-500",
  "bg-indigo-600",
  "bg-teal-600",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(prenom: string, nom: string) {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Status Badge Component
const StatusBadge = ({ status }: { status: UserStatus }) => {
  const config: Record<
    UserStatus,
    {
      label: string;
      icon: React.ReactNode;
      className: string;
    }
  > = {
    PENDING_VERIFICATION: {
      label: "En attente",
      icon: <Clock size={12} />,
      className: "bg-[#e68b3c]/10 text-[#e68b3c]",
    },
    PENDING_AI_REVIEW: {
      label: "Vérification IA",
      icon: <Eye size={12} />,
      className: "bg-[#3b82f6]/10 text-[#3b82f6]",
    },
    PENDING_MANUAL_REVIEW: {
      label: "À vérifier",
      icon: <ShieldAlert size={12} />,
      className: "bg-[#8b5cf6]/10 text-[#8b5cf6]",
    },
    ACTIVE: {
      label: "Acceptée",
      icon: <Check size={12} />,
      className: "bg-[#25a04f]/10 text-[#25a04f]",
    },
    REFUSED: {
      label: "Refusée",
      icon: <X size={12} />,
      className: "bg-red-100 text-red-600",
    },
    SUSPENDED: {
      label: "Suspendue",
      icon: <UserX size={12} />,
      className: "bg-gray-100 text-gray-600",
    },
  };

  const { label, icon, className } = config[status] || config.PENDING_VERIFICATION;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};

// Plan Badge
const PlanBadge = ({ plan }: { plan: string }) => {
  const config: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-600",
    PREMIUM: "bg-amber-50 text-amber-700",
    BUSINESS: "bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${config[plan] || config.FREE}`}
    >
      {plan === "FREE" ? "Gratuit" : plan === "PREMIUM" ? "Premium" : "Business"}
    </span>
  );
};

const TableNewDamande = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [membres, setMembres] = useState<Membre[]>([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch des membres
  const fetchMembres = async (search?: string) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ limit: "5" });
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/membres?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMembres(data.membres);
        setTotal(data.total);
        setPendingCount(data.pendingCount);
      }
    } catch (error) {
      console.error("Erreur fetch membres:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembres();
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembres(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 lg:px-6 lg:py-5 border-b border-colorBorder">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-[16px] font-semibold text-colorTitle">
              Nouvelles demandes d&apos;adhésion
            </h3>
            <p className="text-[13px] text-colorMuted">
              {pendingCount} demande{pendingCount > 1 ? "s" : ""} en attente de
              validation
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted"
            />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[180px] lg:w-[200px] pl-9 pr-3 py-2 text-[13px] border border-colorBorder rounded-lg bg-bgCard text-colorTitle placeholder:text-colorMuted focus:outline-none focus:border-bgSidebar transition-all duration-200"
            />
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-colorBorder rounded-lg text-[13px] font-medium text-colorTitle hover:bg-bgGray transition-all duration-200">
            <SlidersHorizontal size={16} />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-colorBorder">
              <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                Membre
              </th>
              <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                Date
              </th>
              <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                Plan
              </th>
              <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                Statut
              </th>
              <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-colorMuted">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[13px]">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : membres.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-[13px] text-colorMuted">
                    {searchQuery
                      ? "Aucun membre trouvé pour cette recherche."
                      : "Aucun membre inscrit pour le moment."}
                  </p>
                </td>
              </tr>
            ) : (
              membres.map((membre) => (
                <tr
                  key={membre.id}
                  className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/50 transition-colors duration-200"
                >
                  {/* Membre */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold ${getAvatarColor(membre.prenom + membre.nom)}`}
                      >
                        {getInitials(membre.prenom, membre.nom)}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-colorTitle">
                          {membre.prenom} {membre.nom}
                        </p>
                        <p className="text-[12px] text-colorMuted">
                          {membre.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-colorTitle">
                      {formatDate(membre.createdAt)}
                    </span>
                  </td>

                  {/* Plan */}
                  <td className="px-4 py-4">
                    <PlanBadge plan={membre.plan} />
                  </td>

                  {/* Statut */}
                  <td className="px-4 py-4">
                    <StatusBadge status={membre.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/membres/liste/${membre.id}`}
                      className="px-3 py-1.5 border border-colorBorder rounded-lg text-[12px] font-medium text-colorTitle hover:bg-bgGray transition-all duration-200"
                    >
                      Voir la fiche
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {total > 0 && (
        <div className="flex justify-end px-6 py-4">
          <Link
            href="/admin/membres/liste"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-colorTitle hover:underline transition-all duration-200"
          >
            Voir tous les membres ({total})
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default TableNewDamande;
