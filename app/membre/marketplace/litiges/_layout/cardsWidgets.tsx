"use client";

import { AlertTriangle, BarChart3, Check, Hourglass } from "lucide-react";
import React from "react";

// Types
interface StatCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
    description?: string;
}

// Stat Card Component (design d’origine : icône, label, valeur, description)
const StatCard = ({ icon, iconBgColor, value, label, description }: StatCardProps) => {
    return (
        <div className="bg-bgCard rounded-xl p-5 flex flex-col gap-4 cardShadow h-full">
            <div className={`w-[48px] h-[48px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                {icon}
            </div>

            <p className="text-[36px] font-bold leading-none text-colorTitle">
                {value}
            </p>

            <p className="text-[12px] font-medium text-colorMuted">{label}</p>

            {description ? (
                <p className="text-[12px] font-medium text-colorMuted">{description}</p>
            ) : null}
        </div>
    );
};

// Données : Litiges ouverts, En investigation, Résolus ce mois, Temps de résolution moy.
// iconBgColor : couleurs pleines projet (rouge, orange, vert, bleu)
const cardsData: StatCardProps[] = [
    {
        id: "litiges_ouverts",
        icon: <AlertTriangle size={22} className="text-white" />,
        iconBgColor: "bg-[#dd3d3d]",
        value: 3,
        label: "Litiges ouverts",
    },
    {
        id: "en_investigation",
        icon: <Hourglass size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: 1,
        label: "En investigation",
    },
    {
        id: "resolus_mois",
        icon: <Check size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: 24,
        label: "Résolus ce mois",
    },
    {
        id: "temps_resolution",
        icon: <BarChart3 size={22} className="text-white" />,
        iconBgColor: "bg-[#3a86ff]",
        value: "2.1j",
        label: "Temps de résolution moy.",
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
                    <div key={card.id} className="shrink-0 w-[260px] lg:flex-1 lg:min-w-0">
                        <StatCard {...card} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardsWidgets;
