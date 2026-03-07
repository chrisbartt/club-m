"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Download, Filter, Search, X as XIcon } from "lucide-react";
import { useState } from "react";

// Types
type TypeNotification = "rappel" | "alerte" | "annonce";
type StatutNotification = "envoye";

interface Notification {
    id: string;
    date: string; // ex: "25 Mar 14:30"
    type: TypeNotification;
    destinataires: string;
    message: string;
    statut: StatutNotification;
}

// Badge Type : Rappel (bleu), Alerte (orange), Annonce (terracotta)
const TypeBadge = ({ type }: { type: TypeNotification }) => {
    const config = {
        rappel: { label: "Rappel", className: "bg-[#3a86ff]/10 text-[#3a86ff]" },
        alerte: { label: "Alerte", className: "bg-[#e68b3c]/10 text-[#e68b3c]" },
        annonce: { label: "Annonce", className: "bg-[#b58b72]/15 text-[#b58b72]" },
    };
    const { label, className } = config[type];
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${className}`}>
            {label}
        </span>
    );
};

// Badge Statut : Envoyé (vert), extensible pour d'autres statuts
const StatutBadge = ({ statut }: { statut: StatutNotification }) => {
    const label = statut === "envoye" ? "Envoyé" : statut;
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
            {label}
        </span>
    );
};

// Mock Data - Notifications
const mockNotifications: Notification[] = [
    {
        id: "1",
        date: "25 Mar 14:30",
        type: "rappel",
        destinataires: "Tontine Solidarité (24)",
        message: "Rappel paiement mensuel",
        statut: "envoye",
    },
    {
        id: "2",
        date: "24 Mar 10:00",
        type: "alerte",
        destinataires: "Flora T., Diane M.",
        message: "Avertissement retard paiement",
        statut: "envoye",
    },
    {
        id: "3",
        date: "20 Mar 09:00",
        type: "annonce",
        destinataires: "Tous les membres (156)",
        message: "Nouvelle tontine disponible",
        statut: "envoye",
    },
];

interface Filters {
    type: string;
    statut: string;
}

const defaultFilters: Filters = { type: "tous", statut: "tous" };

const TableNotifications = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockNotifications.filter((n) => {
        const matchSearch =
            !searchQuery ||
            n.destinataires.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = filters.type === "tous" || n.type === filters.type;
        const matchStatut = filters.statut === "tous" || n.statut === filters.statut;
        return matchSearch && matchType && matchStatut;
    });

    const totalNotifications = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalNotifications / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Historiques des notifications</h3>
                    <span className="text-[14px] text-colorMuted">({totalNotifications})</span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end gap-3">
                    <div className="relative w-full max-w-[250px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher une notification..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-bgCard dark:bg-transparent border-colorBorder text-[13px] placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-10 px-4 border-colorBorder text-colorTitle hover:bg-bgGray gap-2 shadow-none cursor-pointer dark:bg-bgCard dark:border-colorBorder"
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filtrer</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[320px] p-5" align="end">
                            <div className="mb-5">
                                <h4 className="text-[12px] font-semibold text-bgSidebar uppercase tracking-wide mb-3">
                                    Filtres
                                </h4>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Type</label>
                                        <Select value={filters.type} onValueChange={(v) => handleFilterChange("type", v)}>
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="rappel">Rappel</SelectItem>
                                                <SelectItem value="alerte">Alerte</SelectItem>
                                                <SelectItem value="annonce">Annonce</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Statut</label>
                                        <Select value={filters.statut} onValueChange={(v) => handleFilterChange("statut", v)}>
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="envoye">Envoyé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-colorBorder">
                                <Button
                                    variant="outline"
                                    className="h-9 px-4 border-colorBorder text-colorTitle hover:bg-bgGray gap-2 shadow-none cursor-pointer"
                                    onClick={resetFilters}
                                >
                                    <XIcon size={14} />
                                    Réinitialiser
                                </Button>
                                <Button
                                    className="h-9 px-4 bg-bgSidebar text-white hover:bg-bgSidebar/90 gap-2 shadow-none cursor-pointer"
                                    onClick={applyFilters}
                                >
                                    <Filter size={14} />
                                    Appliquer
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button className="h-10 px-4 bg-bgSidebar text-white hover:bg-bgSidebar/90 gap-2 shadow-none cursor-pointer dark:bg-bgGray">
                        <Download size={16} />
                        <span className="hidden sm:inline">Exporter</span>
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="border-y border-colorBorder bg-bgGray/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Date
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Type
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Destinataires
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Message
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Statut
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((notif) => (
                            <tr
                                key={notif.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-[13px] text-colorTitle">{notif.date}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <TypeBadge type={notif.type} />
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[13px] text-colorTitle">{notif.destinataires}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[13px] text-colorTitle">{notif.message}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <StatutBadge statut={notif.statut} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalNotifications} sur {totalNotifications} notifications
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-colorMuted hover:text-colorTitle disabled:opacity-50 transition-colors cursor-pointer"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={16} />
                        Précédent
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-colorTitle font-medium hover:text-bgSidebar disabled:opacity-50 transition-colors cursor-pointer"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Suivant
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableNotifications;
