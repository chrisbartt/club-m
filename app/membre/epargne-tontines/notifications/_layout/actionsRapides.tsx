"use client";

import { modalNotificationDialogName } from "@/components/features/tontines/modalNotification/modalNotificationt";
import { modalRappelPayDialogName } from "@/components/features/tontines/modalRappelPay/modalRappelPay";
import { useDialog } from "@/context/dialog-context";
import { AlarmClock, Calendar, Megaphone, Smartphone } from "lucide-react";
import React from "react";

// Types
interface ActionCardProps {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    onClick?: () => void;
}

// Carte : bloc icône à gauche, titre à droite (design d’origine)
const ActionCard = ({ icon, iconBgColor, title, onClick }: ActionCardProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="bg-bgCard rounded-xl p-3 flex items-center gap-4 cardShadow h-full w-full text-left transition-colors cursor-pointer"
        >
            <div className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0 ${iconBgColor}`}>
                {icon}
            </div>
            <h3 className="text-[14px] font-semibold text-colorTitle">{title}</h3>
        </button>
    );
};

// Données : Notification Masse, Rappel Paiement, Campagne SMS, Planifier (vos couleurs)
const actionsData: ActionCardProps[] = [
    {
        id: "notification_masse",
        icon: <Megaphone size={22} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: "Notification Masse",
    },
    {
        id: "rappel_paiement",
        icon: <AlarmClock size={22} className="text-[#dd3d3d]" />,
        iconBgColor: "bg-[#dd3d3d]/10",
        title: "Rappel Paiement",
    },
    {
        id: "campagne_sms",
        icon: <Smartphone size={22} className="text-[#3a86ff]" />,
        iconBgColor: "bg-[#3a86ff]/10",
        title: "Campagne SMS",
    },
    {
        id: "planifier",
        icon: <Calendar size={22} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        title: "Planifier",
    },
];

const ActionsRapides = () => {
    const { openDialog } = useDialog();

    const getActionClick = (id: string) => {
        if (id === "notification_masse") return () => openDialog(modalNotificationDialogName);
        if (id === "rappel_paiement") return () => openDialog(modalRappelPayDialogName);
        return undefined;
    };

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-[16px] font-semibold text-colorTitle">Actions rapides</h2>

            <div
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e5e5 transparent" }}
            >
                {actionsData.map((action) => (
                    <div key={action.id} className="shrink-0 w-[160px] sm:w-[180px] xl:flex-1 xl:min-w-0">
                        <ActionCard {...action} onClick={getActionClick(action.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionsRapides;
