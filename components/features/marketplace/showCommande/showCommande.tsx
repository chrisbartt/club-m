"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useDrawer } from "@/context/drawer-context";
import {
    Calendar,
    MessageCircle,
    Package,
    Pause,
    StickyNote,
    Users,
    Wrench,
    X,
} from "lucide-react";
import { useState } from "react";

// Données détail commande (maquette)
const commandeData = {
    numero: "CMD-2025-0467",
    statut: "en_cours" as const,
    montant: "$150",
    montantLabel: "Montant en séquestre",
};

const clientData = {
    initiales: "GK",
    nom: "Grace Kabongo",
    avatarColor: "bg-[#3a86ff]",
};

const prestatatoireData = {
    initiales: "KC",
    nom: "Keza Consulting",
    avatarColor: "bg-[#25a04f]",
};

const serviceData = {
    nom: "Accompagnement Business Plan",
    prix: "$150",
    delai: "2 semaines",
};

interface TimelineEvent {
    id: number;
    title: string;
    detail: string;
    dotStyle: "green" | "blue" | "outline";
}

const timelineData: TimelineEvent[] = [
    {
        id: 1,
        title: "Commande créée",
        detail: "Aujourd'hui, 09:15 • Paiement validé",
        dotStyle: "green",
    },
    {
        id: 2,
        title: "Acceptée par prestataire",
        detail: "Aujourd'hui, 09:45",
        dotStyle: "blue",
    },
    {
        id: 3,
        title: "En cours de réalisation",
        detail: "Livraison prévue : 28 Mars",
        dotStyle: "outline",
    },
];

const ShowCommande = () => {
    const { isDrawerOpen, closeDrawer } = useDrawer();
    const [notes, setNotes] = useState("");

    const handleSauvegarderNotes = () => {
        // Persister les notes côté admin
    };

    return (
        <Sheet
            open={isDrawerOpen("ShowCommande")}
            onOpenChange={() => closeDrawer("ShowCommande")}
        >
            <SheetContent className="border-0 bg-bgCard w-[640px] max-w-[100%!important] sm:max-w-[100%!important] [&>button]:hidden p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 py-4 border-b border-colorBorder">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-[18px] font-semibold text-colorTitle flex items-center gap-2">
                            Détail Commande {commandeData.numero}
                        </SheetTitle>
                        <Button
                            onClick={() => closeDrawer("ShowCommande")}
                            className="p-2 h-auto cursor-pointer rounded-full bg-bgGray/80 hover:bg-bgGray hover:text-colorTitle transition-colors group shadow-none"
                            aria-label="Fermer"
                        >
                            <X className="h-5 w-5 text-colorMuted group-hover:text-colorTitle" />
                        </Button>
                    </div>
                </SheetHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Bloc statut + montant en séquestre */}
                    <div className="p-5 bg-[#3a86ff]/10 rounded-xl mb-5">
                        <div className="flex flex-col items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#3a86ff]/20 text-[#3a86ff]">
                                <span className="w-2 h-2 rounded-full bg-[#3a86ff]" />
                                En cours
                            </span>
                            <p className="text-[28px] font-bold text-colorTitle">
                                {commandeData.montant}
                            </p>
                            <p className="text-[13px] text-colorMuted">
                                {commandeData.montantLabel}
                            </p>
                        </div>
                    </div>

                    {/* PARTIES */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Users size={14} />
                            Parties
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-bgGray/50 rounded-xl border border-colorBorder/50">
                                <p className="text-[10px] font-medium text-colorMuted uppercase tracking-wider mb-2">
                                    Client
                                </p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-semibold shrink-0 ${clientData.avatarColor}`}
                                    >
                                        {clientData.initiales}
                                    </div>
                                    <p className="text-[14px] font-semibold text-colorTitle">
                                        {clientData.nom}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-bgGray/50 rounded-xl border border-colorBorder/50">
                                <p className="text-[10px] font-medium text-colorMuted uppercase tracking-wider mb-2">
                                    Prestataire
                                </p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-semibold shrink-0 ${prestatatoireData.avatarColor}`}
                                    >
                                        {prestatatoireData.initiales}
                                    </div>
                                    <p className="text-[14px] font-semibold text-colorTitle">
                                        {prestatatoireData.nom}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SERVICE COMMANDÉ */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Package size={14} />
                            Service commandé
                        </h4>
                        <div className="p-4 bg-bgGray/50 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-colorMuted">
                                    Service
                                </span>
                                <span className="text-[14px] font-semibold text-colorTitle">
                                    {serviceData.nom}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-colorMuted">
                                    Prix
                                </span>
                                <span className="text-[14px] font-semibold text-colorTitle">
                                    {serviceData.prix}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-colorMuted">
                                    Délai annoncé
                                </span>
                                <span className="text-[14px] font-semibold text-colorTitle">
                                    {serviceData.delai}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CHRONOLOGIE */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Calendar size={14} />
                            Chronologie
                        </h4>
                        <div className="flex flex-col">
                            {timelineData.map((event, index) => (
                                <div key={event.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-3 h-3 rounded-full shrink-0 ${event.dotStyle === "green"
                                                    ? "bg-[#25a04f]"
                                                    : event.dotStyle === "blue"
                                                        ? "bg-[#3a86ff]"
                                                        : "bg-transparent border-2 border-gray-300"
                                                }`}
                                        />
                                        {index < timelineData.length - 1 && (
                                            <div className="w-[2px] flex-1 min-h-[24px] bg-gray-200 my-1" />
                                        )}
                                    </div>
                                    <div className="pb-5">
                                        <p className="text-[14px] font-semibold text-colorTitle">
                                            {event.title}
                                        </p>
                                        <p className="text-[12px] text-colorMuted">
                                            {event.detail}
                                        </p>
                                    </div>
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
                                Contacter le client
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-11 justify-start gap-2 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none cursor-pointer"
                            >
                                <MessageCircle size={18} />
                                Contacter le prestataire
                            </Button>
                            <Button
                                className="w-full h-11 justify-start gap-2 bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90 shadow-none cursor-pointer"
                            >
                                <Pause size={18} />
                                Mettre en pause
                            </Button>
                            <Button
                                className="w-full h-11 justify-start gap-2 bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 shadow-none cursor-pointer"
                            >
                                <X size={18} />
                                Annuler la commande
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
                            placeholder="Ajouter une note interne (non visible)..."
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

export default ShowCommande;
