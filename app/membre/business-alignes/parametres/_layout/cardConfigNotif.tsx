"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface NotifItem {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

const CardConfigNotif = () => {
    const [notifs, setNotifs] = useState<NotifItem[]>([
        {
            id: "rappel_7j",
            title: "Rappel inactivité 7 jours",
            description: "Email automatique après 7 jours sans activité",
            enabled: true,
        },
        {
            id: "alerte_deadline",
            title: "Alerte deadline",
            description: "Notification quand une échéance approche",
            enabled: true,
        },
        {
            id: "felicitations",
            title: "Félicitations finalisation",
            description: "Email de congratulations à la fin du BP",
            enabled: true,
        },
    ]);

    const toggleNotif = (id: string) => {
        setNotifs((prev) =>
            prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
        );
    };

    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 py-5 px-6 border-b border-colorBorder">
                <h3 className="text-[16px] font-semibold text-colorTitle">
                    Notifications automatiques
                </h3>
            </div>

            <div className="flex-1 flex flex-col gap-4">
                {/* List */}
            <div className="divide-y divide-colorBorder">
                {notifs.map((notif) => (
                    <div
                        key={notif.id}
                        className="flex items-center justify-between gap-4 py-4 px-6"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-colorTitle">
                                {notif.title}
                            </p>
                            <p className="text-[13px] text-colorMuted mt-0.5">
                                {notif.description}
                            </p>
                        </div>
                        <Switch
                            checked={notif.enabled}
                            onCheckedChange={() => toggleNotif(notif.id)}
                            className="data-[state=checked]:bg-bgSidebar shrink-0"
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4 px-6 py-5 mt-auto">
                <Button
                    className="h-11 px-8 bg-primaryColor text-white hover:bg-primaryColor/90 font-semibold shadow-none"
                >
                    Enregistrer les modifications
                </Button>
            </div>
            </div>
        </div>
    );
};

export default CardConfigNotif;
