"use client";

import {
    CheckCircle2,
    FileText,
    Calendar,
    Store,
    GraduationCap,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Types
interface ModuleCardProps {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    description: string;
    status?: {
        type: "completed" | "progress" | "badge";
        value: string;
        progress?: number;
        step?: string;
    };
    action: {
        label: string;
        href: string;
        variant?: "primary" | "secondary" | "default";
    };
    details?: string;
}

// Module Card Component
const ModuleCard = ({
    icon,
    iconBgColor,
    title,
    description,
    status,
    action,
    details,
}: ModuleCardProps) => {
    const getButtonClass = (variant?: string) => {
        switch (variant) {
            case "primary":
                return "bg-yellow-400 hover:bg-yellow-500 text-bgSidebar dark:text-colorTitle font-semibold";
            case "secondary":
                return "bg-bgSidebar dark:bg-bgGray hover:opacity-90 text-white font-medium";
            default:
                return "bg-bgCard border border-colorBorder hover:bg-bgGray text-colorTitle font-medium";
        }
    };

    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 flex flex-col gap-4 cardShadow h-full">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center ${iconBgColor}`}>
                    {icon}
                </div>
                {status && (
                    <>
                        {status.type === "completed" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
                                <CheckCircle2 size={12} />
                                {status.value}
                            </span>
                        )}
                        {status.type === "badge" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#3b82f6]/10 text-[#3b82f6]">
                                {status.value}
                            </span>
                        )}
                    </>
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="text-[16px] font-semibold text-colorTitle mb-2">{title}</h3>
                <p className="text-[13px] text-colorMuted mb-4">{description}</p>

                {/* Progress or Details */}
                {status?.type === "progress" && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[12px] text-colorMuted">{status.step}</span>
                            <span className="text-[12px] font-semibold text-colorTitle">{status.value}</span>
                        </div>
                        <div className="w-full h-[6px] bg-bgGray rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                style={{ width: `${status.progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {details && (
                    <p className="text-[12px] text-colorMuted mb-4">{details}</p>
                )}
            </div>

            {/* Action Button */}
            <Link
                href={action.href}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[13px] transition-colors ${getButtonClass(action.variant)}`}
            >
                <span>{action.label}</span>
                {action.variant === "primary" && <ArrowRight size={14} />}
            </Link>
        </div>
    );
};

// Main Component
const CardsWidgets = () => {
    const modules: ModuleCardProps[] = [
        {
            icon: <FileText size={24} className="text-[#3b82f6]" />,
            iconBgColor: "bg-[#3b82f6]/10",
            title: "Business Aligné",
            description: "Clarifie et valide ton idée de business.",
            status: {
                type: "completed",
                value: "Complété",
            },
            action: {
                label: "Revoir mon parcours",
                href: "/membre/business-alignes",
                variant: "default",
            },
        },
       
        {
            icon: <Calendar size={24} className="text-[#25a04f]" />,
            iconBgColor: "bg-[#25a04f]/10",
            title: "Événements",
            description: "Lunchs, ateliers et masterclass.",
            status: {
                type: "badge",
                value: "1 événement à venir",
            },
            details: "Prochain : Lunch Business - 8 Fév",
            action: {
                label: "Voir les événements",
                href: "/membre/evenements",
                variant: "secondary",
            },
        },
        {
            icon: <Store size={24} className="text-[#00b8db]" />,
            iconBgColor: "bg-[#00b8db]/10",
            title: "Marketplace",
            description: "Vends tes produits à la communauté.",
            status: {
                type: "badge",
                value: "3 offres actives",
            },
            action: {
                label: "Gérer mes offres",
                href: "/membre/marketplace",
                variant: "default",
            },
        },
        {
            icon: <GraduationCap size={24} className="text-[#a55b46]" />,
            iconBgColor: "bg-[#a55b46]/10",
            title: "Formations",
            description: "Développe tes compétences business.",
            status: {
                type: "progress",
                value: "67%",
                progress: 67,
                step: "2 formations suivies",
            },
            action: {
                label: "Continuer",
                href: "/membre/evenements",
                variant: "default",
            },
        },
    ];

    return (
        <div className="cards-widgets">
            {/* Page Title */}
            <div className="mb-6">
                <h2 className="text-[24px] lg:text-[28px] font-bold text-colorTitle mb-2">
                    Mon tableau de bord
                </h2>
                <p className="text-[14px] text-colorMuted">
                    Bienvenue dans ton espace Club M
                </p>
            </div>

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {modules.map((module, index) => (
                    <ModuleCard key={index} {...module} />
                ))}
            </div>
        </div>
    );
};

export default CardsWidgets;
