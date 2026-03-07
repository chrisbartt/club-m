"use client";

import {
    BarChart2,
    CreditCard,
    Landmark,
    ShieldAlert,
    TrendingUp,
    Users2,
} from "lucide-react";
import React from "react";

// Types
interface ActionCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    description: string;
    onClick?: () => void;
}

// Carte : bloc icône à gauche, titre + description à droite (design d’origine)
const ActionCard = ({ icon, iconBgColor, title, description, onClick }: ActionCardProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="bg-bgCard rounded-xl p-3 flex items-center gap-4 cardShadow h-full w-full text-left transition-colors cursor-pointer"
        >
            <div className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
                {icon}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
                <h3 className="text-[14px] font-semibold text-colorTitle">{title}</h3>
                <p className="text-[12px] text-colorMuted">{description}</p>
            </div>
        </button>
    );
};

// Données : 6 cartes — bleu (#3a86ff), mauve (violet), bgSidebar, terracotta, rouge, orange, vert
const actionsData: ActionCardProps[] = [
    {
        id: "profils_membres",
        icon: <Users2 size={22} className="text-[#3a86ff]" />,
        iconBgColor: "bg-[#3a86ff]/10",
        title: "Profils Membres",
        description: "Liste avec scores",
    },
    {
        id: "statistiques_tontines",
        icon: <BarChart2 size={22} className="text-[#8b5cf6]" />,
        iconBgColor: "bg-[#8b5cf6]/10",
        title: "Statistiques Tontines",
        description: "Performance",
    },
    {
        id: "paiements",
        icon: <CreditCard size={22} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        title: "Paiements",
        description: "Historique",
    },
    {
        id: "rapport_risques",
        icon: <ShieldAlert size={22} className="text-[#dd3d3d]" />,
        iconBgColor: "bg-[#dd3d3d]/10",
        title: "Rapport Risques",
        description: "Alertes",
    },
    {
        id: "dossier_bancaire",
        icon: <Landmark size={22} className="text-[#3a86ff]" />,
        iconBgColor: "bg-[#3a86ff]/10",
        title: "Dossier Bancaire",
        description: "Format Rawbank",
    },
    {
        id: "rapport_executif",
        icon: <TrendingUp size={22} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: "Rapport Exécutif",
        description: "KPIs direction",
    },
];

const ActionsRapides = () => {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-[16px] font-semibold text-colorTitle">Centre d&apos;exportation</h2>

            <div className="grid grid-cols-12 gap-4">
                {actionsData.map((action) => (
                    <div key={action.id} className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <ActionCard {...action} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionsRapides;
