"use client";

import {
    CheckCircle,
    CircleDollarSign,
    RefreshCw,
    TrendingUp,
    Users,
} from "lucide-react";
import React from "react";

// Types
interface StatCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
    badge?: {
        value: string;
        type: "up" | "neutral";
    };
    badges?: { value: string; className: string }[];
}

// Stat Card Component
const StatCard = ({ icon, iconBgColor, value, label, badge, badges }: StatCardProps) => {
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

            {/* Badge(s) */}
            {badges ? (
                <div className="flex flex-wrap gap-2">
                    {badges.map((b, i) => (
                        <span
                            key={i}
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium ${b.className}`}
                        >
                            {b.value}
                        </span>
                    ))}
                </div>
            ) : badge ? (
                <div className={`inline-flex items-center gap-1 text-[12px] font-medium ${badge.type === "up" ? "text-[#25a04f]" : "text-colorMuted"}`}>
                    {badge.type === "up" && <TrendingUp size={14} />}
                    <span>{badge.value}</span>
                </div>
            ) : null}
        </div>
    );
};

// Cards Data
const cardsData: StatCardProps[] = [
    {
        id: "tontines_totales",
        icon: <RefreshCw size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: "18",
        label: "Tontines totales",
        badges: [
            { value: "8 actives", className: "bg-[#25a04f]/10 text-[#25a04f]" },
            { value: "6 à venir", className: "bg-bgSidebar/10 text-bgSidebar" },
        ],
    },
    {
        id: "volume_epargne",
        icon: <CircleDollarSign size={22} className="text-white" />,
        iconBgColor: "bg-[#3a86ff]",
        value: "$124,800",
        label: "Volume total épargné",
        badge: { value: "↑ +12.5% vs mois précédent", type: "up" as const },
    },
    {
        id: "participantes",
        icon: <Users size={22} className="text-white" />,
        iconBgColor: "bg-[#8c49b1]",
        value: "156",
        label: "Participantes",
        badge: { value: "↑ +8 ce mois", type: "up" as const },
    },
    {
        id: "taux_ponctualite",
        icon: <CheckCircle size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: "87.3%",
        label: "Taux de ponctualité",
        badge: { value: "↑ +2.1%", type: "up" as const },
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
