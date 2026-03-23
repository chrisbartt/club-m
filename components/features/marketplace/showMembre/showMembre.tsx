"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useDialog } from "@/context/dialog-context";
import { useDrawer } from "@/context/drawer-context";
import {
    BarChart3,
    ClipboardList,
    Eye,
    MessageCircle,
    Package,
    Pause,
    Star,
    StickyNote,
    User,
    Wrench,
    X,
} from "lucide-react";
import { useState } from "react";

// Données membre business (maquette)
const memberData = {
    initials: "MK",
    name: "Marie Kamba",
    business: "Keza Consulting",
    avatarColor: "bg-[#3a86ff]",
    statut: "actif" as const,
};

// Statistiques
const statsData = [
    { value: "24", label: "Commandes" },
    { value: "$3,450", label: "CA généré" },
    { value: "4.9", label: "Note moyenne", withStar: true },
    { value: "3", label: "Services actifs" },
];

// Services publiés
interface Service {
    id: number;
    title: string;
    details: string;
    statut: "actif" | "brouillon";
}

const servicesData: Service[] = [
    { id: 1, title: "Accompagnement BP", details: "$150 • 12 commandes", statut: "actif" },
    { id: 2, title: "Formation Leadership", details: "$300 • 8 commandes", statut: "actif" },
    { id: 3, title: "Coaching Individuel", details: "Sur devis • 0 commandes", statut: "brouillon" },
];

const ShowMembre = () => {
    const { isDrawerOpen, closeDrawer } = useDrawer();
    const { openDialog } = useDialog();
    const [notes, setNotes] = useState("");

    const handleSauvegarderNotes = () => {
        // Persister les notes côté admin
    };

    return (
        <Sheet
            open={isDrawerOpen("ShowMembre")}
            onOpenChange={() => closeDrawer("ShowMembre")}
        >
            <SheetContent className="border-0 bg-bgCard w-[640px] max-w-[100%!important] sm:max-w-[100%!important] [&>button]:hidden p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 py-4 border-b border-colorBorder">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-[18px] font-semibold text-colorTitle flex items-center gap-2">
                            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-bgGray/80 text-colorTitle">
                                <User size={18} />
                            </span>
                            Membre Business
                        </SheetTitle>
                        <Button
                            onClick={() => closeDrawer("ShowMembre")}
                            className="p-2 h-auto cursor-pointer rounded-full bg-transparent hover:bg-bgGray hover:text-colorTitle transition-colors group shadow-none"
                            aria-label="Fermer"
                        >
                            <X className="h-5 w-5 text-colorMuted group-hover:text-colorTitle" />
                        </Button>
                    </div>
                </SheetHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Bloc infos membre */}
                    <div className="flex flex-col items-center p-6 bg-bgGray/50 rounded-xl mb-5">
                        <div
                            className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-[22px] font-semibold mb-3 ${memberData.avatarColor}`}
                        >
                            {memberData.initials}
                        </div>
                        <p className="text-[16px] font-semibold text-colorTitle">
                            {memberData.name}
                        </p>
                        <p className="text-[14px] text-[#e68b3c] mb-2">
                            {memberData.business}
                        </p>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#25a04f] text-white">
                            Actif
                        </span>
                    </div>

                    {/* STATISTIQUES */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <BarChart3 size={14} />
                            Statistiques
                        </h4>
                        <div className="grid grid-cols-2 gap-3 p-4 bg-bgGray/50 rounded-xl">
                            {statsData.map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center justify-center py-2"
                                >
                                    <span className="text-[20px] font-bold text-colorTitle flex items-center gap-1">
                                        {stat.withStar && (
                                            <Star
                                                size={18}
                                                className="fill-amber-400 text-amber-400 shrink-0"
                                            />
                                        )}
                                        {stat.value}
                                    </span>
                                    <span className="text-[12px] text-colorMuted">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SERVICES PUBLIÉS */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Package size={14} />
                            Services publiés
                        </h4>
                        <div className="flex flex-col gap-2">
                            {servicesData.map((service) => (
                                <div
                                    key={service.id}
                                    className="flex items-center justify-between p-4 bg-bgGray/50 rounded-xl"
                                >
                                    <div>
                                        <p className="text-[14px] font-semibold text-colorTitle">
                                            {service.title}
                                        </p>
                                        <p className="text-[12px] text-colorMuted">
                                            {service.details}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-[11px] font-medium shrink-0 ${service.statut === "actif"
                                                ? "bg-[#25a04f] text-white"
                                                : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {service.statut === "actif"
                                            ? "Actif"
                                            : "Brouillon"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACTIONS ADMIN */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Wrench size={14} />
                            Actions admin
                        </h4>
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                className="w-full h-11 justify-start gap-2 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none cursor-pointer"
                            >
                                <MessageCircle size={18} />
                                Contacter
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-11 justify-start gap-2 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none cursor-pointer"
                            >
                                <ClipboardList size={18} />
                                Voir toutes les commandes
                            </Button>
                            <Button
                                className="w-full h-11 justify-start gap-2 bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90 shadow-none cursor-pointer"
                            >
                                <Eye size={18} />
                                Mettre sous surveillance
                            </Button>
                            <Button
                                onClick={() => openDialog("coachingDialog")}
                                className="w-full h-11 justify-start gap-2 bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 shadow-none cursor-pointer"
                            >
                                <Pause size={18} />
                                Suspendre le compte
                            </Button>
                        </div>
                    </div>

                    {/* NOTES INTERNES */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <StickyNote size={14} />
                            Notes internes
                        </h4>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Notes visibles uniquement par l'admin..."
                            className="min-h-[120px] text-[14px] border-colorBorder shadow-none focus-visible:ring-0 resize-y mb-3"
                        />
                        <Button
                            variant="outline"
                            onClick={handleSauvegarderNotes}
                            className="w-full h-10 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none cursor-pointer"
                        >
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ShowMembre;
