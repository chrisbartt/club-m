import { Mail } from "lucide-react";
import Link from "next/link";
import { useDialog } from '@/context/dialog/contextDialog';

// Types
interface Membre {
    id: string;
    initials: string;
    name: string;
    status: "Premium" | "Free" | "Business";
    priority: "haute" | "moyenne" | "faible";
    description: string;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: Membre["status"] }) => {
    const styles = {
        Premium: "bg-[#8c49b1]/10 text-[#8c49b1]",
        Free: "bg-[#25a04f]/10 text-[#25a04f]",
        Business: "bg-[#e68b3c]/10 text-[#e68b3c]",
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${styles[status]}`}>
            {status}
        </span>
    );
};

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: Membre["priority"] }) => {
    const styles = {
        haute: "bg-red-100 text-red-600",
        moyenne: "bg-orange-100 text-orange-600",
        faible: "bg-blue-100 text-blue-600",
    };

    const labels = {
        haute: "PRIORITÉ HAUTE",
        moyenne: "PRIORITÉ MOYENNE",
        faible: "PRIORITÉ FAIBLE",
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${styles[priority]}`}>
            {labels[priority]}
        </span>
    );
};

// Border color based on priority
const getBorderColor = (priority: Membre["priority"]) => {
    const colors = {
        haute: "border-l-red-500",
        moyenne: "border-l-orange-400",
        faible: "border-l-blue-500",
    };
    return colors[priority];
};

// Avatar background color based on status
const getAvatarBgColor = (status: Membre["status"]) => {
    const colors = {
        Premium: "bg-[#8c49b1]",
        Free: "bg-[#25a04f]",
        Business: "bg-[#e68b3c]",
    };
    return colors[status];
};

// Member Row Component
const MemberRow = ({ membre }: { membre: Membre }) => {
    const { openDialog } = useDialog();
    return (
        <div
            className={`flex items-center gap-4 py-5 border-b border-colorBorder`}
        >
            {/* Avatar */}
            <div className={`w-[50px] h-[50px] rounded-full flex items-center justify-center text-white font-semibold text-[15px] flex-shrink-0 ${getAvatarBgColor(membre.status)}`}>
                {membre.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-[15px] text-colorTitle">{membre.name}</span>
                    <StatusBadge status={membre.status} />
                    <PriorityBadge priority={membre.priority} />
                </div>
                <p className="text-[13px] text-colorMuted truncate">{membre.description}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <button className="w-[40px] h-[40px] rounded-lg border border-colorBorder bg-bgCard flex items-center justify-center text-colorMuted hover:bg-bgGray hover:text-colorTitle cursor-pointer transition-colors" onClick={() => openDialog("messageDialog")}>
                    <Mail size={18} />
                </button>
                <Link href={`/membres/liste/${membre.id}`} className="px-4 py-2 rounded-lg bg-bgSidebar dark:bg-bgGray text-white text-[13px] font-medium hover:opacity-90 transition-opacity cursor-pointer">
                    Fiche
                </Link>
            </div>
        </div>
    );
};

// Mock Data
const membresData: Membre[] = [
    {
        id: "1",
        initials: "GM",
        name: "Grace Mbeki",
        status: "Premium",
        priority: "haute",
        description: "Inactive 21j - BP à 65% avant arrêt",
    },
    {
        id: "2",
        initials: "EN",
        name: "Esther Nkumu",
        status: "Free",
        priority: "moyenne",
        description: "Épargne commencée mais 0 dépôt depuis 2 sem.",
    },
    {
        id: "3",
        initials: "MK",
        name: "Marie Kabila",
        status: "Business",
        priority: "faible",
        description: "BP terminé mais 0 produit marketplace",
    },
    {
        id: "4",
        initials: "FL",
        name: "Florence Lukusa",
        status: "Free",
        priority: "moyenne",
        description: "Engagement 18% - Inactive 45 jours",
    },
];

const CardSuiviMembres = () => {
    
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 px-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-colorBorder">
                <div className="flex items-center gap-2">

                    <h3 className="text-[16px] font-semibold text-colorTitle">Membres à accompagner</h3>
                </div>
                <button className="px-4 py-2 rounded-lg border border-colorBorder text-[13px] font-medium text-colorTitle hover:bg-gray-50 transition-colors">
                    Voir tous (12)
                </button>
            </div>

            {/* Members List */}
            <div className="flex flex-col">
                {membresData.map((membre) => (
                    <MemberRow key={membre.id} membre={membre} />
                ))}
            </div>
        </div>
    );
};

export default CardSuiviMembres;
