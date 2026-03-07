"use client";

import { BarChart3, CheckSquare, CircleDollarSign, Timer } from "lucide-react";
import React from "react";

// Types
interface StatCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
    description?: string;
    descriptionColor?: string;
}

// Stat Card Component
const StatCard = ({ icon, iconBgColor, value, label, description, descriptionColor = "text-[#25a04f]" }: StatCardProps) => {
    return (
        <div className="bg-bgCard rounded-xl md:p-5 p-4 flex flex-col gap-4 cardShadow h-full">
            {/* Icon */}
            <div className={`md:w-[48px] w-[40px] md:h-[48px] h-[40px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                {icon}
            </div>

            {/* Label */}
            <p className="text-[12px] font-medium text-colorMuted uppercase tracking-wide">{label}</p>

            {/* Value */}
            <p className="md:text-[36px] text-[28px] font-bold text-colorTitle leading-none">{value}</p>

            {/* Description */}
            {description && (
                <p className={`text-[12px] font-medium ${descriptionColor}`}>{description}</p>
            )}
        </div>
    );
};

// Cards Data
const cardsData: StatCardProps[] = [
    {
        id: "total_bp",
        icon: <BarChart3 size={22} className="text-white" />,
        iconBgColor: "bg-bgSidebar",
        value: "42",
        label: "Total BP créés",
        description: "↑ +6 ce mois",
        descriptionColor: "text-[#25a04f]",
    },
    {
        id: "taux_completion",
        icon: <CheckSquare size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: "26%",
        label: "Taux de complétion",
        description: "↑ +4% vs Q3",
        descriptionColor: "text-[#25a04f]",
    },
    {
        id: "temps_moyen",
        icon: <Timer size={22} className="text-colorMuted" />,
        iconBgColor: "bg-gray-100",
        value: "45j",
        label: "Temps moyen",
        description: "Pour finaliser",
        descriptionColor: "text-colorMuted",
    },
    {
        id: "revenue_total",
        icon: <CircleDollarSign size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: "$18,900",
        label: "Revenue total",
        description: "↑ Depuis le lancement",
        descriptionColor: "text-[#25a04f]",
    },
];

// Main Component
const CardsWidgets = () => {
    return (
        <div className="cards-widgets">
            {/* Cards Row - 4 Cards (Scrollable on mobile) */}
            <div
                className="flex md:gap-4 gap-3 overflow-x-auto pb-2"
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
