import {
    ArrowRight,
    BarChart3,
    FolderOpen,
    Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// Types
interface AccesItem {
    id: string;
    href: string;
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    subtitle: string;
}

// Acces Row Component
const AccesRow = ({ item }: { item: AccesItem }) => {
    return (
        <Link
            href={item.href}
            className="flex items-center gap-4 p-4 rounded-xl border border-colorBorder hover:bg-bgGray transition-colors"
        >
            {/* Icon */}
            <div className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBgColor}`}>
                {item.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-colorTitle">{item.title}</p>
                <p className="text-[13px] text-colorMuted">{item.subtitle}</p>
            </div>

            {/* Arrow */}
            <ArrowRight size={18} className="text-colorMuted flex-shrink-0" />
        </Link>
    );
};

// Acces Data
const accesData: AccesItem[] = [
    {
        id: "1",
        href: "/business-plans/liste",
        icon: <FolderOpen size={22} className="text-[#3a86ff]" />,
        iconBgColor: "bg-[#3a86ff]/10",
        title: "Tous les dossiers",
        subtitle: "Gérer et filtrer les dossiers",
    },
    {
        id: "2",
        href: "/business-plans/alertes",
        icon: <Zap size={22} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: "Alertes & Relances",
        subtitle: "8 membres à accompagner",
    },
    {
        id: "3",
        href: "/business-plans/statistiques",
        icon: <BarChart3 size={22} className="text-[#8c49b1]" />,
        iconBgColor: "bg-[#8c49b1]/10",
        title: "Statistiques",
        subtitle: "Rapports et analyses",
    },
];

const CardAcces = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 px-6 h-full">
            {/* Header */}
            <h3 className="text-[16px] font-semibold text-colorTitle mb-4">Accès rapide</h3>

            {/* Acces List */}
            <div className="flex flex-col gap-3">
                {accesData.map((item) => (
                    <AccesRow key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default CardAcces;
