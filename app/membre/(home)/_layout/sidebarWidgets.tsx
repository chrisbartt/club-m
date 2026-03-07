"use client";

import { CheckCircle2, Calendar, PiggyBank, Store, Zap } from "lucide-react";
import Link from "next/link";

// Types
interface Event {
    id: string;
    jour: string;
    mois: string;
    titre: string;
    heure: string;
    lieu: string;
    status: "inscrite" | "disponible";
}

interface Activity {
    id: string;
    icon: React.ReactNode;
    message: string;
    timestamp: string;
}

// Event Item Component
const EventItem = ({ event }: { event: Event }) => {
    return (
        <div className="flex items-start gap-4 py-4 border-b border-colorBorder last:border-b-0">
            <div className="flex flex-col items-center min-w-[50px]">
                <span className="text-[20px] font-bold text-colorTitle">{event.jour}</span>
                <span className="text-[10px] uppercase text-colorMuted">{event.mois}</span>
            </div>
            <div className="flex-1">
                <h4 className="text-[14px] font-semibold text-colorTitle mb-1">{event.titre}</h4>
                <p className="text-[12px] text-colorMuted mb-2">
                    {event.heure} • {event.lieu}
                </p>
                {event.status === "inscrite" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
                        <CheckCircle2 size={10} />
                        Inscrite
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#3b82f6]/10 text-[#3b82f6]">
                        Places dispo
                    </span>
                )}
            </div>
        </div>
    );
};

// Activity Item Component
const ActivityItem = ({ activity }: { activity: Activity }) => {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-colorBorder last:border-b-0">
            <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center bg-yellow-400/10 shrink-0">
                {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] text-colorTitle mb-1">{activity.message}</p>
                <p className="text-[11px] text-colorMuted">{activity.timestamp}</p>
            </div>
        </div>
    );
};

// Mock Data
const eventsData: Event[] = [
    {
        id: "1",
        jour: "08",
        mois: "FÉV",
        titre: "Lunch Business Networking",
        heure: "12h00",
        lieu: "Kinshasa",
        status: "inscrite",
    },
    {
        id: "2",
        jour: "15",
        mois: "FÉV",
        titre: "Atelier Marketing Digital",
        heure: "14h00",
        lieu: "En ligne",
        status: "inscrite",
    },
    {
        id: "3",
        jour: "22",
        mois: "FÉV",
        titre: "Masterclass : L&apos;art du Pitch",
        heure: "10h00",
        lieu: "En ligne",
        status: "disponible",
    },
];

const activitiesData: Activity[] = [
    {
        id: "1",
        icon: <CheckCircle2 size={16} className="text-[#25a04f]" />,
        message: "Tu as complété l'étape 6 de ton Business Plan 🎉",
        timestamp: "Il y a 2 heures",
    },
    {
        id: "2",
        icon: <PiggyBank size={16} className="text-[#e68b3c]" />,
        message: 'Versement de $25 effectué dans "Mamans Entrepreneures"',
        timestamp: "Hier",
    },
    {
        id: "3",
        icon: <Calendar size={16} className="text-[#25a04f]" />,
        message: "Inscription confirmée au Lunch Business du 8 février",
        timestamp: "Il y a 3 jours",
    },
    {
        id: "4",
        icon: <Store size={16} className="text-[#00b8db]" />,
        message: "Nouvelle commande reçue sur ta boutique !",
        timestamp: "Il y a 5 jours",
    },
];

const SidebarWidgets = () => {
    return (
        <div className="flex flex-col gap-6">
            {/* Événements à Venir */}
            <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow">
                <h3 className="text-[16px] font-semibold text-colorTitle mb-4">
                    Événements à venir
                </h3>
                <div className="flex flex-col">
                    {eventsData.map((event) => (
                        <EventItem key={event.id} event={event} />
                    ))}
                </div>
                <Link
                    href="/membre/evenements"
                    className="mt-4 inline-flex items-center justify-center w-full px-4 py-2.5 bg-bgSidebar dark:bg-bgGray hover:opacity-90 text-white font-medium rounded-lg transition-colors text-[13px]"
                >
                    Voir tous les événements
                </Link>
            </div>

            {/* Activité Récente */}
            <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-[16px] font-semibold text-colorTitle">
                        Activité récente
                    </h3>
                </div>
                <div className="flex flex-col">
                    {activitiesData.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SidebarWidgets;
