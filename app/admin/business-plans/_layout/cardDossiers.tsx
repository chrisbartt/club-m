import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Types
type DossierStatus = "en_cours" | "rdv_pris" | "nouveau" | "bloque";

interface Dossier {
    id: string;
    initials: string;
    name: string;
    project: string;
    progress: number;
    status: DossierStatus;
    avatarColor: string;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: DossierStatus }) => {
    const config = {
        en_cours: { label: "EN COURS", className: "bg-[#25a04f]/10 text-[#25a04f] border border-[#25a04f]/30" },
        rdv_pris: { label: "RDV PRIS", className: "bg-bgSidebar/10 text-bgSidebar border border-bgSidebar/30" },
        nouveau: { label: "NOUVEAU", className: "bg-[#fef9c3] text-[#a16207] border border-[#fde047]/50" },
        bloque: { label: "BLOQUÉ", className: "bg-[#fee2e2] text-[#dc2626] border border-[#fca5a5]/50" },
    };

    const { label, className } = config[status];

    return (
        <span className={`px-3 py-1 rounded-md text-[11px] font-medium ${className}`}>
            {label}
        </span>
    );
};

// Dossier Row Component
const DossierRow = ({ dossier }: { dossier: Dossier }) => {
    return (
        <div className="flex items-center gap-4 py-4 border-b border-colorBorder last:border-b-0">
            {/* Avatar */}
            <div
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-white font-semibold text-[13px] flex-shrink-0"
                style={{ backgroundColor: dossier.avatarColor }}
            >
                {dossier.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] text-colorTitle mb-0.5">{dossier.name}</p>
                <p className="text-[13px] text-colorMuted">
                    {dossier.project} • {dossier.progress}%
                </p>
            </div>

            {/* Status Badge */}
            <StatusBadge status={dossier.status} />
        </div>
    );
};

// Mock Data
const dossiersData: Dossier[] = [
    {
        id: "1",
        initials: "MK",
        name: "Marie Kabila",
        project: "Salon Beauté Marie",
        progress: 92,
        status: "en_cours",
        avatarColor: "#8b5a2b",
    },
    {
        id: "2",
        initials: "GM",
        name: "Grace Mutombo",
        project: "Coaching bien-être",
        progress: 75,
        status: "rdv_pris",
        avatarColor: "#1e3a5f",
    },
    {
        id: "3",
        initials: "FM",
        name: "Farah Mbuyi",
        project: "Formation marketing",
        progress: 15,
        status: "nouveau",
        avatarColor: "#2d5a5a",
    },
    {
        id: "4",
        initials: "AM",
        name: "Aline Makoso",
        project: "Boutique Mode",
        progress: 35,
        status: "bloque",
        avatarColor: "#8b6914",
    },
];

const CardDossiers = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 px-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[16px] font-semibold text-colorTitle">Dossiers récents</h3>
                <Link
                    href="/business-plans/liste"
                    className="flex items-center gap-1 text-[13px] font-medium text-colorMuted hover:text-colorTitle transition-colors"
                >
                    Tout voir <ArrowRight size={14} />
                </Link>
            </div>

            {/* Dossiers List */}
            <div className="flex flex-col">
                {dossiersData.map((dossier) => (
                    <DossierRow key={dossier.id} dossier={dossier} />
                ))}
            </div>
        </div>
    );
};

export default CardDossiers;
