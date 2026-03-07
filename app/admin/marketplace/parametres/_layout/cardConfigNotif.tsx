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
            id: "nouveaux_litiges",
            title: "Nouveaux litiges",
            description: "Email immédiat",
            enabled: true,
        },
        {
            id: "livraisons",
            title: "Livraisons",
            description: "Notification dashboard",
            enabled: true,
        },
        {
            id: "expiration_delais",
            title: "Expiration délais",
            description: "Email + dashboard",
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
            <div className="flex items-center gap-2 md:py-5 py-4 md:px-6 px-5 border-b border-colorBorder">
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
                            className="flex items-center justify-between gap-4 py-4 md:px-6 px-5"
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
                <div className="flex md:justify-end md:pt-4 px-6 py-5 pt-0 mt-auto">
                    <Button
                        className="h-11 w-full md:auto px-8 bg-primaryColor rounded-lg text-white hover:bg-primaryColor/90 font-semibold shadow-none"
                    >
                        Enregistrer les modifications
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CardConfigNotif;
