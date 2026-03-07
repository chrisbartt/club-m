import {
    CheckCircle,
    GraduationCap,
    Store,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// Types
interface ModuleCardProps {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    progressLabel: string;
    progressValue: number;
    progressColor: string;
    stats: {
        label: string;
        value: string | number;
    }[];
}

// Module Card Component
const ModuleCard = ({
    icon,
    iconBgColor,
    title,
    progressLabel,
    progressValue,
    progressColor,
    stats,
}: ModuleCardProps) => {
    return (
        <div className="bg-bgCard rounded-xl p-5 flex flex-col gap-4 cardShadow h-full">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className={`w-[40px] h-[40px] rounded-xl flex items-center justify-center ${iconBgColor}`}>
                    {icon}
                </div>
                <h3 className="text-[15px] font-semibold text-colorTitle">{title}</h3>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[13px]">
                    <span className="text-colorMuted">{progressLabel}</span>
                    <span className="font-semibold text-colorTitle">{progressValue}%</span>
                </div>
                <div className="w-full h-[6px] bg-bgGray rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${progressColor}`}
                        style={{ width: `${progressValue}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-1.5">
                {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between text-[13px]">
                        <span className="text-colorMuted">{stat.label}</span>
                        <span className="font-medium text-colorTitle">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Link */}
            <Link href="/admin/membres/liste/2" className="flex items-center gap-1.5 text-[13px] font-medium text-colorTitle hover:underline mt-auto">
                <span>Voir les membres</span>
            </Link>
        </div>
    );
};

// Modules Data
const modulesData: ModuleCardProps[] = [
    {
        icon: <CheckCircle size={20} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        title: "Business Aligné",
        progressLabel: "Progression",
        progressValue: 72,
        progressColor: "bg-[#25a04f]",
        stats: [
            { label: "En cours", value: 156 },
            { label: "Terminés", value: 89 },
        ],
    },
    // {
    //     icon: <FileText size={20} className="text-[#3b82f6]" />,
    //     iconBgColor: "bg-[#3b82f6]/10",
    //     title: "Business Plan",
    //     progressLabel: "Progression",
    //     progressValue: 58,
    //     progressColor: "bg-[#3b82f6]",
    //     stats: [
    //         { label: "BP en cours", value: 234 },
    //         { label: "BP validés", value: 67 },
    //     ],
    // },
    // {
    //     icon: <PiggyBank size={20} className="text-[#e68b3c]" />,
    //     iconBgColor: "bg-[#e68b3c]/10",
    //     title: "Épargne Intelligente",
    //     progressLabel: "Objectif",
    //     progressValue: 45,
    //     progressColor: "bg-[#e68b3c]",
    //     stats: [
    //         { label: "Actifs", value: 312 },
    //         { label: "Total", value: "45,230 $" },
    //     ],
    // },
    {
        icon: <GraduationCap size={20} className="text-[#8c49b1]" />,
        iconBgColor: "bg-[#8c49b1]/10",
        title: "Formations",
        progressLabel: "Complétion",
        progressValue: 85,
        progressColor: "bg-[#8c49b1]",
        stats: [
            { label: "Inscrites", value: 523 },
            { label: "Certificats", value: 412 },
        ],
    },
    {
        icon: <Store size={20} className="text-[#00b8db]" />,
        iconBgColor: "bg-[#00b8db]/10",
        title: "Marketplace",
        progressLabel: "Actives",
        progressValue: 32,
        progressColor: "bg-[#00b8db]",
        stats: [
            { label: "Vendeuses", value: 74 },
            { label: "Offres", value: 189 },
        ],
    },
];

const ProgressModules = () => {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-[16px] font-semibold text-colorTitle">Vue par module</h2>

            {/* Cards Row - Scrollable on mobile */}
            <div
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e5e5 transparent" }}
            >
                {modulesData.map((module, index) => (
                    <div key={index} className="flex-shrink-0 w-[220px] xl:flex-1 xl:min-w-0">
                        <ModuleCard {...module} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressModules;
