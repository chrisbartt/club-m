"use client";

import {
    Crown,
    Gem,
    Heart,
    Sprout,
    TrendingDown,
    TrendingUp,
    Users,
} from "lucide-react";
import React, { useState } from "react";

// Types
interface MemberCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
    badge: {
        value: string;
        type: "up" | "down";
    };
    isSelected?: boolean;
    onClick?: () => void;
}

// Member Card Component
const MemberCard = ({ icon, iconBgColor, value, label, badge, isSelected, onClick }: MemberCardProps) => {
    return (
        <div
            onClick={onClick}
            className={`bg-bgCard rounded-xl p-5 flex flex-col gap-4 cardShadow h-full cursor-pointer transition-all duration-200 hover:shadow-lg ${isSelected ? "ring-2 ring-bgSidebar" : ""
                }`}
        >
            {/* Icon */}
            <div className={`w-[48px] h-[48px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                {icon}
            </div>

            {/* Value */}
            <div>
                <p className="text-[36px] font-bold text-colorTitle leading-none">{value}</p>
            </div>

            {/* Label & Badge */}
            <div className="flex flex-col gap-1">
                <p className="text-[14px] font-medium text-colorTitle">{label}</p>
                <div className={`inline-flex items-center gap-1 text-[12px] font-medium ${badge.type === "up" ? "text-emerald-600" : "text-red-500"
                    }`}>
                    {badge.type === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{badge.value}</span>
                </div>
            </div>
        </div>
    );
};

// Cards Data
const cardsData = [
    {
        id: "all",
        icon: <Users size={22} className="text-white" />,
        iconBgColor: "bg-[#3b82f6]",
        value: "1,284",
        label: "Tous les membres",
        badge: { value: "+12% ce mois", type: "up" as const },
    },
    {
        id: "business",
        icon: <Crown size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: "231",
        label: "Business",
        badge: { value: "+8%", type: "up" as const },
    },
    {
        id: "premium",
        icon: <Gem size={22} className="text-white" />,
        iconBgColor: "bg-[#8c49b1]",
        value: "450",
        label: "Premium",
        badge: { value: "+15%", type: "up" as const },
    },
    {
        id: "free",
        icon: <Sprout size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: "603",
        label: "Free",
        badge: { value: "+18%", type: "up" as const },
    },
    {
        id: "accompagner",
        icon: <Heart size={22} className="text-white" />,
        iconBgColor: "bg-[#d92828]",
        value: "12",
        label: "À accompagner",
        badge: { value: "-2 cette semaine", type: "down" as const },
    },
];

// Main Component
const CardsWidgets = () => {
    const [selectedCard, setSelectedCard] = useState<string>("all");

    return (
        <div className="cards-widgets">
            {/* Cards Row - 5 Cards (Scrollable on mobile) */}
            <div
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e5e5 transparent" }}
            >
                {cardsData.map((card) => (
                    <div key={card.id} className="flex-shrink-0 w-[200px] xl:flex-1 xl:min-w-0">
                        <MemberCard
                            {...card}
                            isSelected={selectedCard === card.id}
                            onClick={() => setSelectedCard(card.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardsWidgets;
