import {
    Award,
    Calendar,
    Check,
    CheckCircle,
    CircleDollarSign,
    ExternalLink,
    FileText,
    GraduationCap,
    Info,
    Package,
    PiggyBank,
    Store,
    User,
} from "lucide-react";
import React from "react";

// Types
type ModuleStatus = "en_cours" | "complete" | "non_demarre";

interface ModuleData {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    percentage: number;
    progressColor: string;
    status: ModuleStatus;
    stats: React.ReactNode;
    buttonLabel: string;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: ModuleStatus }) => {
    const config = {
        en_cours: { label: "En cours", className: "bg-[#3b82f6]/10 text-[#3b82f6]" },
        complete: { label: "Complété", className: "bg-[#25a04f]/10 text-[#25a04f]" },
        non_demarre: { label: "Non démarré", className: "bg-bgGray text-colorTitle" },
    };

    const { label, className } = config[status];

    return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${className}`}>
            {label}
        </span>
    );
};

// Module Card Component
const ModuleCard = ({ icon, iconBgColor, title, percentage, progressColor, status, stats, buttonLabel }: ModuleData) => {
    return (
        <div className="bg-bgCard rounded-xl p-5 cardShadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-[40px] h-[40px] rounded-xl flex items-center justify-center ${iconBgColor}`}>
                        {icon}
                    </div>
                    <span className="text-[15px] font-semibold text-colorTitle">{title}</span>
                </div>
                <StatusBadge status={status} />
            </div>

            {/* Progress Bar */}
            <div className="w-full h-[6px] bg-bgGray rounded-full overflow-hidden mb-3">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-[12px] text-colorMuted mb-4">
                {stats}
            </div>

            {/* Button */}
            <button className="inline-flex items-center gap-2 px-3 py-2 border border-colorBorder rounded-lg text-[12px] font-medium text-colorTitle hover:bg-bgGray transition-colors cursor-pointer">
                <ExternalLink size={14} />
                {buttonLabel}
            </button>
        </div>
    );
};

// Mock Data
const modulesData: ModuleData[] = [
    {
        icon: <FileText size={18} className="text-[#3b82f6]" />,
        iconBgColor: "bg-[#3b82f6]/10",
        title: "Business Plan",
        percentage: 65,
        progressColor: "bg-[#3b82f6]",
        status: "en_cours",
        stats: (
            <>
                <span className="flex items-center gap-1"><CheckCircle size={12} /> 8/12 sections</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Modif: 21j</span>
                <span className="flex items-center gap-1"><User size={12} /> Coach: Marie D.</span>
            </>
        ),
        buttonLabel: "Ouvrir le BP",
    },
    {
        icon: <PiggyBank size={18} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: "Épargne Intelligente",
        percentage: 38,
        progressColor: "bg-[#e68b3c]",
        status: "en_cours",
        stats: (
            <>
                <span className="flex items-center gap-1"><CircleDollarSign size={12} /> 450 $ / 1,200 $</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Dernier: 35j</span>
                <span className="flex items-center gap-1"><Check size={12} /> 10/12 à temps</span>
            </>
        ),
        buttonLabel: "Voir les tontines",
    },
    {
        icon: <GraduationCap size={18} className="text-[#8c49b1]" />,
        iconBgColor: "bg-[#8c49b1]/10",
        title: "Formations",
        percentage: 100,
        progressColor: "bg-[#8c49b1]",
        status: "complete",
        stats: (
            <>
                <span className="flex items-center gap-1"><FileText size={12} /> 3 formations</span>
                <span className="flex items-center gap-1"><Award size={12} /> 2 certificats</span>
            </>
        ),
        buttonLabel: "Voir formations",
    },
    {
        icon: <Store size={18} className="text-[#00b8db]" />,
        iconBgColor: "bg-[#00b8db]/10",
        title: "Marketplace",
        percentage: 0,
        progressColor: "bg-gray-300",
        status: "non_demarre",
        stats: (
            <>
                <span className="flex items-center gap-1"><Info size={12} /> Disponible</span>
                <span className="flex items-center gap-1"><Package size={12} /> 0 produits</span>
            </>
        ),
        buttonLabel: "Voir marketplace",
    },
];

const EtatModul = () => {
    return (
        <div className="etat-modul">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[16px] font-semibold text-colorTitle">Progression par module</h3>
            </div>

            {/* Modules Grid */}
            <div className="flex flex-col gap-4">
                {modulesData.map((module, index) => (
                    <ModuleCard key={index} {...module} />
                ))}
            </div>
        </div>
    );
};

export default EtatModul;
