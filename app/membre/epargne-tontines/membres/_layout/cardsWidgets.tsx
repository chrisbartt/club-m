"use client";

import { AlertTriangle, Star, Users, XCircle } from "lucide-react";
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

// Stat Card Component (design d’origine : icône, label, valeur, description)
const StatCard = ({ icon, iconBgColor, value, label, description }: StatCardProps) => {
    return (
        <div className="bg-bgCard rounded-xl p-5 flex flex-col gap-4 cardShadow h-full">
            <div className={`w-[48px] h-[48px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                {icon}
            </div>

            <p className="text-[12px] font-medium text-colorMuted uppercase tracking-wide">{label}</p>

            <p
                className="text-[36px] font-bold leading-none text-colorTitle"
                
            >
                {value}
            </p>

            <p className="text-[12px] font-medium text-colorMuted">{description}</p>
        </div>
    );
};

// Données : Total, Fiables, À surveiller, Risque
const cardsData: StatCardProps[] = [
    {
        id: "total",
        icon: <Users size={22} className="text-white" />,
        iconBgColor: "bg-[#3a86ff]",
        value: 156,
        label: "Total",
        description: "Membres inscrits",
    },
    {
        id: "fiables",
        icon: <Star size={22} className="text-white fill-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: 112,
        label: "Fiables",
        description: "Bonne ponctualité",
    },
    {
        id: "a_surveiller",
        icon: <AlertTriangle size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: 32,
        label: "À surveiller",
        description: "Ponctualité à améliorer",
    },
    {
        id: "risque",
        icon: <XCircle size={22} className="text-white" />,
        iconBgColor: "bg-[#dd3d3d]",
        value: 12,
        label: "Risque",
        description: "Retards répétés",
    },
];

const CardsWidgets = () => {
    return (
        <div className="cards-widgets">
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
