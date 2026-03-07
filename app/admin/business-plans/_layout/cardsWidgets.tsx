"use client";

import {
    AlertTriangle,
    CheckCircle,
    CircleDollarSign,
    FileText,
    TrendingUp,
} from "lucide-react";
import React from "react";

// Types
interface StatCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
    badge: {
        value: string;
        type: "up" | "neutral";
    };
}

// Stat Card Component
const StatCard = ({ icon, iconBgColor, value, label, badge }: StatCardProps) => {
    return (
        <div className="bg-bgCard rounded-xl p-5 flex flex-col gap-4 cardShadow h-full">
            {/* Icon */}
            <div className={`w-[48px] h-[48px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                {icon}
            </div>

            {/* Label */}
            <p className="text-[12px] font-medium text-colorMuted uppercase tracking-wide">{label}</p>

            {/* Value */}
            <p className="text-[36px] font-bold text-colorTitle leading-none">{value}</p>

            {/* Badge */}
            <div className={`inline-flex items-center gap-1 text-[12px] font-medium ${badge.type === "up" ? "text-emerald-600" : "text-colorMuted"
                }`}>
                {badge.type === "up" && <TrendingUp size={14} />}
                <span>{badge.value}</span>
            </div>
        </div>
    );
};

// Cards Data
const cardsData: StatCardProps[] = [
    {
        id: "en_cours",
        icon: <FileText size={22} className="text-white" />,
        iconBgColor: "bg-[#3b82f6]",
        value: "28",
        label: "Dossiers en cours",
        badge: { value: "↑ +5 cette semaine", type: "up" as const },
    },
    {
        id: "finalises",
        icon: <CheckCircle size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: "11",
        label: "Dossiers finalisés",
        badge: { value: "↑ +3 vs mois dernier", type: "up" as const },
    },
    {
        id: "relancer",
        icon: <AlertTriangle size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: "5",
        label: "À relancer",
        badge: { value: "Inactifs > 7 jours", type: "neutral" as const },
    },
    {
        id: "chiffre_affaires",
        icon: <CircleDollarSign size={22} className="text-white" />,
        iconBgColor: "bg-[#8c49b1]",
        value: "$18,900",
        label: "Chiffre d'affaires",
        badge: { value: "↑ +$2,250 ce mois", type: "up" as const },
    },
];

// Main Component
const CardsWidgets = () => {
    return (
        <div className="cards-widgets">
            {/* Cards Row - 4 Cards (Scrollable on mobile) */}
            <div
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e5e5 transparent" }}
            >
                {cardsData.map((card) => (
                    <div key={card.id} className="flex-shrink-0 w-[220px] xl:flex-1 xl:min-w-0">
                        <StatCard {...card} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardsWidgets;
