import { AlertTriangle, CheckCircle, Clock, Package } from "lucide-react";
import React from "react";

// Types
interface StatusRowProps {
    icon: React.ReactNode;
    iconBgColor: string;
    label: string;
    count: number;
    progressColor: string;
    progressPercent: number;
    isDanger?: boolean;
}

// Status Row: icon (left), label, progress bar, count (right) — design avec icônes
const StatusRow = ({ icon, iconBgColor, label, count, progressColor, progressPercent, isDanger }: StatusRowProps) => {
    const textClass = isDanger ? "text-[#dd3d3d]" : "text-colorTitle";
    return (
        <div className="py-4 border-t border-colorBorder first:border-t-0">
            <div className="flex items-center gap-3">
                <div className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center shrink-0 ${iconBgColor}`}>
                    {icon}
                </div>
                <span className={`text-[14px] font-semibold ${textClass} shrink-0 min-w-[140px]`}>{label}</span>
                <div className="flex-1 min-w-0 h-[6px] bg-bgGray rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                        style={{ width: `${Math.max(progressPercent, 2)}%` }}
                    />
                </div>
                <span className={`text-[14px] font-bold shrink-0 ${textClass}`}>{count}</span>
            </div>
        </div>
    );
};

// Données : Validées, En cours, Livrées (attente validation), En litige — couleurs projet + icônes
const totalCommandes = 89;
const statusData: StatusRowProps[] = [
    {
        icon: <CheckCircle size={16} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        label: "Validées",
        count: 62,
        progressColor: "bg-[#25a04f]",
        progressPercent: (62 / totalCommandes) * 100,
    },
    {
        icon: <Clock size={16} className="text-[#3a86ff]" />,
        iconBgColor: "bg-[#3a86ff]/10",
        label: "En cours",
        count: 18,
        progressColor: "bg-[#3a86ff]",
        progressPercent: (18 / totalCommandes) * 100,
    },
    {
        icon: <Package size={16} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        label: "Livrées (attente validation)",
        count: 6,
        progressColor: "bg-[#e68b3c]",
        progressPercent: (6 / totalCommandes) * 100,
    },
    {
        icon: <AlertTriangle size={16} className="text-[#dd3d3d]" />,
        iconBgColor: "bg-[#dd3d3d]/10",
        label: "En litige",
        count: 3,
        progressColor: "bg-[#dd3d3d]",
        progressPercent: (3 / totalCommandes) * 100,
        isDanger: true,
    },
];

const StatutCommand = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 px-6 h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[16px] font-semibold text-colorTitle">Statut des commandes</h3>
            </div>

            {/* Status List */}
            <div className="flex flex-col">
                {statusData.map((row, index) => (
                    <StatusRow key={index} {...row} />
                ))}
            </div>
        </div>
    );
};

export default StatutCommand;
