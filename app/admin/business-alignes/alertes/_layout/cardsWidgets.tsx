"use client";

import { AlertOctagon, Clock, Heart } from "lucide-react";
import React from "react";

// Types
interface StatCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
    description: string;
}

// Stat Card Component
const StatCard = ({ icon, iconBgColor, value, label, description }: StatCardProps) => {
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
            <p className="text-[12px] font-medium text-colorMuted">{description}</p>
        </div>
    );
};

// Cards Data
const cardsData: StatCardProps[] = [
    {
        id: "critiques",
        icon: <AlertOctagon size={22} className="text-white" />,
        iconBgColor: "bg-[#dd3d3d]",
        value: "3",
        label: "Critiques",
        description: "Inactifs > 10 jours",
    },
    {
        id: "a_relancer",
        icon: <Clock size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: "5",
        label: "À relancer",
        description: "Inactifs 5-10 jours",
    },
    {
        id: "a_encourager",
        icon: <Heart size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: "7",
        label: "À encourager",
        description: "Proches de finalisation",
    },
];

// Main Component
const CardsWidgets = () => {
    return (
        <div className="cards-widgets">
            {/* Cards Row - 3 Cards (Scrollable on mobile) */}
            <div
                className="flex md:gap-4 gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e5e5 transparent" }}
            >
                {cardsData.map((card) => (
                    <div key={card.id} className="flex-shrink-0 w-[260px] lg:flex-1 lg:min-w-0">
                        <StatCard {...card} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardsWidgets;
