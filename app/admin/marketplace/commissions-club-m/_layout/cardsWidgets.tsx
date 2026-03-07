"use client";

import { BarChart3, DollarSign, TrendingUp } from "lucide-react";
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

// Données : Commissions ce mois, Taux de commission, vs mois dernier
// iconBgColor : couleurs pleines projet, icônes blanches
const cardsData: StatCardProps[] = [
    {
        id: "commissions_mois",
        icon: <DollarSign size={22} className="text-white" />,
        iconBgColor: "bg-[#0d9488]",
        value: "$2,485",
        label: "Commissions ce mois",
    },
    {
        id: "taux_commission",
        icon: <BarChart3 size={22} className="text-white" />,
        iconBgColor: "bg-[#3a86ff]",
        value: "10%",
        label: "Taux de commission",
    },
    {
        id: "vs_mois_dernier",
        icon: <TrendingUp size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",
        value: "+18%",
        label: "vs mois dernier",
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
