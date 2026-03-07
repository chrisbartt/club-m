"use client";

import { BookOpen, Star, Users } from "lucide-react";
import React from "react";

// Types
interface StatCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
}

// Stat Card Component
const StatCard = ({ icon, iconBgColor, value, label }: StatCardProps) => {
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
        </div>
    );
};

// Cards Data
const cardsData: StatCardProps[] = [
    {
        id: "coachs_actifs",
        icon: <Users size={22} className="text-white" />,
        iconBgColor: "bg-[#3b82f6]",
        value: "4",
        label: "Coachs actifs",
    },
    {
        id: "bp_accompagnes",
        icon: <BookOpen size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: "38",
        label: "BP accompagnés",
    },
    {
        id: "satisfaction",
        icon: <Star size={22} className="text-white fill-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: "4.8/5",
        label: "Satisfaction",
    },
];

// Main Component
const CardsWidgets = () => {
    return (
        <div className="cards-widgets">
            {/* Cards Row - 3 Cards (Scrollable on mobile) */}
            <div
                className="flex gap-4 overflow-x-auto pb-2"
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
