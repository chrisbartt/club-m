"use client";

import { AlertTriangle, Check, DollarSign, Lock } from "lucide-react";
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
        <div className="bg-bgCard rounded-xl md:p-5 p-4 flex flex-col gap-4 cardShadow h-full">
            <div className={`md:w-[48px] md:h-[48px] w-[40px] h-[40px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                {icon}
            </div>

            <p className="md:text-[36px] text-[28px] font-bold leading-none text-colorTitle">
                {value}
            </p>

            <p className="text-[12px] font-medium text-colorMuted">{label}</p>

            {description ? (
                <p className="text-[12px] font-medium text-colorMuted">{description}</p>
            ) : null}
        </div>
    );
};

// Données : Volume total (GMV), En séquestre, Paiements libérés, Bloqués (litiges)
// iconBgColor : couleurs pleines projet, icônes blanches
const cardsData: StatCardProps[] = [
    {
        id: "volume_gmv",
        icon: <DollarSign size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: "$24,850",
        label: "Volume total (GMV)",
    },
    {
        id: "en_sequestre",
        icon: <Lock size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: "$4,230",
        label: "En séquestre",
    },
    {
        id: "paiements_liberes",
        icon: <Check size={22} className="text-white" />,
        iconBgColor: "bg-[#3a86ff]",
        value: "$19,770",
        label: "Paiements libérés",
    },
    {
        id: "bloques_litiges",
        icon: <AlertTriangle size={22} className="text-white" />,
        iconBgColor: "bg-[#dd3d3d]",
        value: "$850",
        label: "Bloqués (litiges)",
    },
];

const CardsWidgets = () => {
    return (
        <div className="cards-widgets">
            <div
                className="flex md:gap-4 gap-3 overflow-x-auto pb-2"
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
