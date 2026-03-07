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
import { ChevronLeft, ChevronRight, Download, Filter, Search, Star, X as XIcon } from "lucide-react";
import { useState } from "react";

// Types
type SpecialiteType = "marketing" | "finance" | "generaliste";
type DisponibiliteType = "disponible" | "chargee";

interface Coach {
    id: string;
    initiales: string;
    nom: string;
    role: string;
    avatarColor: string;
    specialite: SpecialiteType;
    bpAssignes: number;
    disponibilite: DisponibiliteType;
    note: number;
}

// Specialite Badge Component
const SpecialiteBadge = ({ specialite }: { specialite: SpecialiteType }) => {
    const config = {
        marketing: {
            label: "Marketing",
            className: "bg-[#25a04f]/10 text-[#25a04f] border border-[#25a04f]/30",
        },
        finance: {
            label: "Finance",
            className: "bg-bgSidebar/10 text-bgSidebar border border-bgSidebar/30",
        },
        generaliste: {
            label: "Généraliste",
            className: "bg-[#e68b3c]/10 text-[#e68b3c] border border-[#e68b3c]/30",
        },
    };

    const { label, className } = config[specialite];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${className}`}>
            {label}
        </span>
    );
};

// Disponibilite Badge Component
const DisponibiliteBadge = ({ disponibilite }: { disponibilite: DisponibiliteType }) => {
    const config = {
        disponible: {
            label: "Disponible",
            className: "bg-[#25a04f]/10 text-[#25a04f]",
        },
        chargee: {
            label: "Chargée",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
        },
    };

    const { label, className } = config[disponibilite];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium ${className}`}>
            {label}
        </span>
    );
};

// Note Component
const NoteDisplay = ({ note }: { note: number }) => {
    return (
        <span className="inline-flex items-center gap-1 text-[14px] font-medium text-colorTitle">
            <Star size={14} className="text-[#e68b3c] fill-[#e68b3c]" />
            {note}
        </span>
    );
};

// Mock Data
const mockCoachs: Coach[] = [
    {
        id: "1",
        initiales: "MM",
        nom: "Marie Marketing",
        role: "Coach Marketing & Stratégie",
        avatarColor: "bg-[#25a04f]",
        specialite: "marketing",
        bpAssignes: 12,
        disponibilite: "disponible",
        note: 4.9,
    },
    {
        id: "2",
        initiales: "JF",
        nom: "Jean Finances",
        role: "Coach Finance & Business Model",
        avatarColor: "bg-bgSidebar",
        specialite: "finance",
        bpAssignes: 10,
        disponibilite: "disponible",
        note: 4.7,
    },
    {
        id: "3",
        initiales: "SM",
        nom: "Sophie Morel",
        role: "Coach Généraliste",
        avatarColor: "bg-[#e68b3c]",
        specialite: "generaliste",
        bpAssignes: 8,
        disponibilite: "chargee",
        note: 4.8,
    },
];

// Filter types
interface Filters {
    specialite: string;
    disponibilite: string;
}

const defaultFilters: Filters = {
    specialite: "tous",
    disponibilite: "tous",
};

const TableCoachs = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const totalCoachs = 3;
    const totalPages = 1;

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
    };

    const applyFilters = () => {
        setIsFilterOpen(false);
        // Apply filters logic here
    };

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between md:gap-4 gap-3 px-5 md:px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Coachs</h3>
                    <span className="text-[14px] text-colorMuted">({totalCoachs})</span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end md:gap-3 gap-2">
                    {/* Search */}
                    <div className="relative w-full max-w-[250px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher un coach..."
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
                        <PopoverContent className="md:w-[400px] w-[300px] p-5" align="end">
                            <div className="mb-5">
                                <h4 className="text-[12px] font-semibold text-bgSidebar uppercase tracking-wide mb-3">
                                    Filtres
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Spécialité */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Spécialité</label>
                                        <Select value={filters.specialite} onValueChange={(v) => handleFilterChange("specialite", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="marketing">Marketing</SelectItem>
                                                <SelectItem value="finance">Finance</SelectItem>
                                                <SelectItem value="generaliste">Généraliste</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Disponibilité */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Disponibilité</label>
                                        <Select value={filters.disponibilite} onValueChange={(v) => handleFilterChange("disponibilite", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="disponible">Disponible</SelectItem>
                                                <SelectItem value="chargee">Chargée</SelectItem>
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
                <table className="w-full">
                    <thead>
                        <tr className="border-y border-colorBorder bg-gray-50/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Coach
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Spécialité
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                BP assignés
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Disponibilité
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Note
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockCoachs.map((coach) => (
                            <tr
                                key={coach.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                {/* Coach */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-white text-[13px] font-semibold ${coach.avatarColor}`}
                                        >
                                            {coach.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-colorTitle">{coach.nom}</p>
                                            <p className="text-[12px] text-colorMuted">{coach.role}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Spécialité */}
                                <td className="px-4 py-4 text-center">
                                    <SpecialiteBadge specialite={coach.specialite} />
                                </td>

                                {/* BP Assignés */}
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[14px] font-medium text-colorTitle">{coach.bpAssignes} BP</span>
                                </td>

                                {/* Disponibilité */}
                                <td className="px-4 py-4 text-center">
                                    <DisponibiliteBadge disponibilite={coach.disponibilite} />
                                </td>

                                {/* Note */}
                                <td className="px-4 py-4 text-center">
                                    <NoteDisplay note={coach.note} />
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 text-center">
                                    <button
                                        className="px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer text-colorMuted hover:text-colorTitle border border-colorBorder hover:bg-bgGray"
                                    >
                                        Voir profil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder flex-col md:flex-row gap-2">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalCoachs} sur {totalCoachs} coachs
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

export default TableCoachs;
