"use client";

import { BarChart3, CircleDollarSign, Megaphone, Plus } from "lucide-react";
import React from "react";

// Types
interface ActionCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
}

// Action Card Component - icône en haut, titre centré en dessous
const ActionCard = ({ icon, iconBgColor, title }: ActionCardProps) => {
    return (
        <button className="bg-bgCard rounded-xl p-3 flex items-center gap-4 cardShadow h-full  w-full text-left transition-colors cursor-pointer">
            <div className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgColor}`}>
                {icon}
            </div>
            <h3 className="text-[14px] font-semibold text-colorTitle text-center">{title}</h3>
        </button>
    );
};

// Actions Data
const actionsData: ActionCardProps[] = [
    {
        id: "creer_tontine",
        icon: <Plus size={24} className="text-colorTitle" />,
        iconBgColor: "bg-bgGray",
        title: "Créer Tontine",
    },
    {
        id: "notification_masse",
        icon: <Megaphone size={22} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: "Notification Masse",
    },
    {
        id: "enregistrer_paiement",
        icon: <CircleDollarSign size={22} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        title: "Enregistrer Paiement",
    },
    {
        id: "generer_rapport",
        icon: <BarChart3 size={22} className="text-[#8c49b1]" />,
        iconBgColor: "bg-[#8c49b1]/10",
        title: "Générer Rapport",
    },
];

const ActionsRapides = () => {
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-[16px] font-semibold text-colorTitle">Actions rapides</h2>

            {/* Cards Row - Scrollable on mobile */}
            <div
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e5e5 transparent" }}
            >
                {actionsData.map((action) => (
                    <div key={action.id} className="flex-shrink-0 w-[160px] sm:w-[180px] xl:flex-1 xl:min-w-0">
                        <ActionCard {...action} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionsRapides;
