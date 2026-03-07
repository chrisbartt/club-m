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
type StatutType = "prevu" | "confirme" | "termine" | "annule";
type TypeRendezVous = "coaching" | "suivi" | "bilan";

interface RendezVous {
    id: string;
    date: string;
    heure: string;
    membre: string;
    membreInitiales: string;
    coach: string;
    coachInitiales: string;
    type: TypeRendezVous;
    statut: StatutType;
}

// Statut Badge Component
const StatutBadge = ({ statut }: { statut: StatutType }) => {
    const config = {
        prevu: {
            label: "Prévu",
            className: "bg-gray-100 text-gray-700 border border-gray-200",
        },
        confirme: {
            label: "Confirmé",
            className: "bg-[#25a04f]/10 text-[#25a04f] border border-[#25a04f]/30",
        },
        termine: {
            label: "Terminé",
            className: "bg-bgSidebar/10 text-bgSidebar border border-bgSidebar/30",
        },
        annule: {
            label: "Annulé",
            className: "bg-red-50 text-red-600 border border-red-200",
        },
    };

    const { label, className } = config[statut];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${className}`}>
            {label}
        </span>
    );
};

// Type Badge Component
const TypeBadge = ({ type }: { type: TypeRendezVous }) => {
    const config = {
        coaching: {
            label: "Coaching",
            className: "bg-[#e68b3c]/10 text-[#e68b3c] border border-[#e68b3c]/30",
        },
        suivi: {
            label: "Suivi",
            className: "bg-bgSidebar/10 text-bgSidebar border border-bgSidebar/30",
        },
        bilan: {
            label: "Bilan",
            className: "bg-[#25a04f]/10 text-[#25a04f] border border-[#25a04f]/30",
        },
    };

    const { label, className } = config[type];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${className}`}>
            {label}
        </span>
    );
};

// Mock Data
const mockRendezVous: RendezVous[] = [
    {
        id: "1",
        date: "10/02/2025",
        heure: "09:00",
        membre: "Marie Dupont",
        membreInitiales: "MD",
        coach: "Jean Finances",
        coachInitiales: "JF",
        type: "coaching",
        statut: "confirme",
    },
    {
        id: "2",
        date: "10/02/2025",
        heure: "11:30",
        membre: "Sophie Martin",
        membreInitiales: "SM",
        coach: "Marie Marketing",
        coachInitiales: "MM",
        type: "suivi",
        statut: "prevu",
    },
    {
        id: "3",
        date: "11/02/2025",
        heure: "14:00",
        membre: "Paul Bernard",
        membreInitiales: "PB",
        coach: "Sophie Morel",
        coachInitiales: "SM",
        type: "bilan",
        statut: "prevu",
    },
    {
        id: "4",
        date: "09/02/2025",
        heure: "10:00",
        membre: "Julie Leroy",
        membreInitiales: "JL",
        coach: "Jean Finances",
        coachInitiales: "JF",
        type: "coaching",
        statut: "termine",
    },
];

// Filter types
interface Filters {
    statut: string;
    type: string;
}

const defaultFilters: Filters = {
    statut: "tous",
    type: "tous",
};

const TableRendezVous = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const totalRendezVous = mockRendezVous.length;
    const totalPages = 1;

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
    };

    const applyFilters = () => {
        setIsFilterOpen(false);
    };

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Liste des rendez-vous</h3>
                    <span className="text-[14px] text-colorMuted">({totalRendezVous})</span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end gap-3">
                    {/* Search */}
                    <div className="relative w-full max-w-[250px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher un rendez-vous..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-white border-colorBorder text-[13px] placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    {/* Filter Popover */}
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-10 px-4 border-colorBorder text-colorTitle hover:bg-bgGray gap-2 shadow-none"
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filtrer</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-5" align="end">
                            <div className="mb-5">
                                <h4 className="text-[12px] font-semibold text-bgSidebar uppercase tracking-wide mb-3">
                                    Filtres
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Statut */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Statut</label>
                                        <Select value={filters.statut} onValueChange={(v) => handleFilterChange("statut", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="prevu">Prévu</SelectItem>
                                                <SelectItem value="confirme">Confirmé</SelectItem>
                                                <SelectItem value="termine">Terminé</SelectItem>
                                                <SelectItem value="annule">Annulé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Type */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Type</label>
                                        <Select value={filters.type} onValueChange={(v) => handleFilterChange("type", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="coaching">Coaching</SelectItem>
                                                <SelectItem value="suivi">Suivi</SelectItem>
                                                <SelectItem value="bilan">Bilan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-colorBorder">
                                <Button
                                    variant="outline"
                                    className="h-9 px-4 border-colorBorder text-colorTitle hover:bg-bgGray gap-2 shadow-none"
                                    onClick={resetFilters}
                                >
                                    <XIcon size={14} />
                                    Réinitialiser
                                </Button>
                                <Button
                                    className="h-9 px-4 bg-bgSidebar text-white hover:bg-bgSidebar/90 gap-2 shadow-none"
                                    onClick={applyFilters}
                                >
                                    <Filter size={14} />
                                    Appliquer
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Download Button */}
                    <Button
                        className="h-10 px-4 bg-bgSidebar text-white hover:bg-bgSidebar/90 gap-2 shadow-none"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Exporter</span>
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-y border-colorBorder bg-gray-50/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Date / Heure
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Membre
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Coach
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Type
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Statut
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRendezVous.map((rdv) => (
                            <tr
                                key={rdv.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                {/* Date / Heure */}
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-[14px] font-medium text-colorTitle">{rdv.date}</p>
                                        <p className="text-[12px] text-colorMuted">{rdv.heure}</p>
                                    </div>
                                </td>

                                {/* Membre */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold bg-[#25a04f]">
                                            {rdv.membreInitiales}
                                        </div>
                                        <span className="text-[14px] font-medium text-colorTitle">{rdv.membre}</span>
                                    </div>
                                </td>

                                {/* Coach */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold bg-bgSidebar">
                                            {rdv.coachInitiales}
                                        </div>
                                        <span className="text-[14px] font-medium text-colorTitle">{rdv.coach}</span>
                                    </div>
                                </td>

                                {/* Type */}
                                <td className="px-4 py-4 text-center">
                                    <TypeBadge type={rdv.type} />
                                </td>

                                {/* Statut */}
                                <td className="px-4 py-4 text-center">
                                    <StatutBadge statut={rdv.statut} />
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 text-center">
                                    <button
                                        className="px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer text-colorMuted hover:text-colorTitle border border-colorBorder hover:bg-bgGray"
                                    >
                                        Voir détail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalRendezVous} sur {totalRendezVous} rendez-vous
                </p>

                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-colorMuted hover:text-colorTitle disabled:opacity-50 transition-colors"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={16} />
                        Précédent
                    </button>

                    <button
                        className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-colorTitle font-medium hover:text-bgSidebar disabled:opacity-50 transition-colors"
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

export default TableRendezVous;
