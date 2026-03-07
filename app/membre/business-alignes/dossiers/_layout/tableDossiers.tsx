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
import { useDrawer } from "@/context/drawer/contextDrawer";
import { ChevronLeft, ChevronRight, Download, Filter, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Types
type StatutType = "actif" | "en_retard" | "bloque" | "inactif" | "termine";
type ActionType = "voir" | "relancer" | "urgent" | "archive";
type ActiviteColor = "green" | "blue" | "orange";

interface Dossier {
    id: string;
    projet: string;
    membreInitiales: string;
    membreNom: string;
    avatarColor: string;
    avancement: number;
    etapeActuelle: string;
    derniereActivite: string;
    activiteColor: ActiviteColor;
    statut: StatutType;
    action: ActionType;
}

// Progress Bar Component
const ProgressBar = ({ value }: { value: number }) => {
    const getBarColor = () => {
        if (value >= 80) return "bg-[#25a04f]";
        if (value >= 50) return "bg-[#e68b3c]";
        return "bg-[#dd3d3d]";
    };

    return (
        <div className="flex items-center gap-3">
            <div className="w-[100px] h-[6px] bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${getBarColor()}`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className="text-[13px] font-medium text-colorTitle">{value}%</span>
        </div>
    );
};

// Statut Badge Component
const StatutBadge = ({ statut }: { statut: StatutType }) => {
    const config = {
        actif: {
            label: "Actif",
            className: "bg-[#25a04f]/10 text-[#25a04f]",
            dotColor: "bg-[#25a04f]",
        },
        en_retard: {
            label: "En retard",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
            dotColor: "bg-[#e68b3c]",
        },
        bloque: {
            label: "Bloqué",
            className: "bg-[#dd3d3d]/10 text-[#dd3d3d]",
            dotColor: "bg-[#dd3d3d]",
        },
        inactif: {
            label: "Inactif",
            className: "bg-[#dd3d3d]/10 text-[#dd3d3d]",
            dotColor: "bg-[#dd3d3d]",
        },
        termine: {
            label: "Terminé",
            className: "bg-[#25a04f]/10 text-[#25a04f]",
            dotColor: "bg-[#25a04f]",
        },
    };

    const { label, className, dotColor } = config[statut];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {label}
        </span>
    );
};

// Activite Badge Component
const ActiviteBadge = ({ label, color }: { label: string; color: ActiviteColor }) => {
    const colors = {
        green: "bg-[#25a04f]/10 text-[#25a04f]",
        blue: "bg-bgSidebar/10 text-bgSidebar",
        orange: "bg-[#e68b3c]/10 text-[#e68b3c]",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${colors[color]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${color === "green" ? "bg-[#25a04f]" : color === "blue" ? "bg-bgSidebar" : "bg-[#e68b3c]"}`} />
            {label}
        </span>
    );
};

// Action Button Component
const ActionButton = ({ action, onShowDetail }: { action: ActionType; onShowDetail: () => void }) => {
    const config = {
        voir: {
            label: "Voir",
            className: "text-colorMuted hover:text-colorTitle border border-colorBorder hover:bg-bgGray",
        },
        relancer: {
            label: "Relancer",
            className: "bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90",
        },
        urgent: {
            label: "Urgent",
            className: "bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90",
        },
        archive: {
            label: "Archive",
            className: "text-colorMuted hover:text-colorTitle border border-colorBorder hover:bg-bgGray",
        },
    };

    const { label, className } = config[action];

    const handleClick = () => {
        if (action !== "archive") {
            onShowDetail();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${className}`}
        >
            {label}
        </button>
    );
};

// Mock Data
const mockDossiers: Dossier[] = [
    {
        id: "1",
        projet: "Salon Beauté Marie",
        membreInitiales: "MK",
        membreNom: "Marie K.",
        avatarColor: "bg-[#25a04f]",
        avancement: 92,
        etapeActuelle: "Finalisation",
        derniereActivite: "Aujourd'hui",
        activiteColor: "green",
        statut: "actif",
        action: "voir",
    },
    {
        id: "2",
        projet: "Esther Couture",
        membreInitiales: "EM",
        membreNom: "Esther M.",
        avatarColor: "bg-[#25a04f]",
        avancement: 88,
        etapeActuelle: "Finance",
        derniereActivite: "Hier",
        activiteColor: "green",
        statut: "actif",
        action: "voir",
    },
    {
        id: "3",
        projet: "Cécile Traiteur",
        membreInitiales: "CB",
        membreNom: "Cécile B.",
        avatarColor: "bg-[#e68b3c]",
        avancement: 62,
        etapeActuelle: "Finance",
        derniereActivite: "Il y a 3j",
        activiteColor: "blue",
        statut: "en_retard",
        action: "relancer",
    },
    {
        id: "4",
        projet: "Boutique Aline Mode",
        membreInitiales: "AM",
        membreNom: "Aline M.",
        avatarColor: "bg-[#8c49b1]",
        avancement: 35,
        etapeActuelle: "Marché",
        derniereActivite: "Il y a 8j",
        activiteColor: "orange",
        statut: "bloque",
        action: "relancer",
    },
    {
        id: "5",
        projet: "Flora Boutique",
        membreInitiales: "FT",
        membreNom: "Flora T.",
        avatarColor: "bg-[#dd3d3d]",
        avancement: 28,
        etapeActuelle: "Marketing",
        derniereActivite: "Il y a 12j",
        activiteColor: "orange",
        statut: "inactif",
        action: "urgent",
    },
    {
        id: "6",
        projet: "Pionnières Café",
        membreInitiales: "JN",
        membreNom: "Jeanne N.",
        avatarColor: "bg-[#25a04f]",
        avancement: 100,
        etapeActuelle: "Terminé ✓",
        derniereActivite: "15 Jan",
        activiteColor: "green",
        statut: "termine",
        action: "archive",
    },
];

// Filter types
interface Filters {
    statut: string;
    avancement: string;
}

const defaultFilters: Filters = {
    statut: "tous",
    avancement: "tous",
};

const TableDossiers = () => {
    const { openDrawer } = useDrawer();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const totalDossiers = 42;
    const totalPages = 7;

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
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Tous les Business Plans</h3>
                    <span className="text-[14px] text-colorMuted">({totalDossiers})</span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end gap-3">
                    {/* Search */}
                    <div className="relative w-full max-w-[250px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher un dossier..."
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
                                                <SelectItem value="actif">Actif</SelectItem>
                                                <SelectItem value="en_retard">En retard</SelectItem>
                                                <SelectItem value="bloque">Bloqué</SelectItem>
                                                <SelectItem value="inactif">Inactif</SelectItem>
                                                <SelectItem value="termine">Terminé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Avancement */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Avancement</label>
                                        <Select value={filters.avancement} onValueChange={(v) => handleFilterChange("avancement", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="haut">Haut (&gt;80%)</SelectItem>
                                                <SelectItem value="moyen">Moyen (50-80%)</SelectItem>
                                                <SelectItem value="bas">Bas (&lt;50%)</SelectItem>
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
                                    <X size={14} />
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
                                Membre
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Projet
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Avancement
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Étape actuelle
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Dernière activité
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
                        {mockDossiers.map((dossier) => (
                            <tr
                                key={dossier.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                {/* Membre */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-white text-[11px] font-semibold ${dossier.avatarColor}`}
                                        >
                                            {dossier.membreInitiales}
                                        </div>
                                        <span className="text-[13px] text-colorTitle">{dossier.membreNom}</span>
                                    </div>
                                </td>

                                {/* Projet */}
                                <td className="px-4 py-4">
                                    <Link
                                        href={`/business-plans/dossiers/${dossier.id}`}
                                        className="text-[14px] font-semibold text-colorTitle hover:text-bgSidebar transition-colors"
                                    >
                                        {dossier.projet}
                                    </Link>
                                </td>

                                {/* Avancement */}
                                <td className="px-4 py-4">
                                    <ProgressBar value={dossier.avancement} />
                                </td>

                                {/* Étape actuelle */}
                                <td className="px-4 py-4">
                                    <span className="text-[13px] text-colorTitle">{dossier.etapeActuelle}</span>
                                </td>

                                {/* Dernière activité */}
                                <td className="px-4 py-4">
                                    <ActiviteBadge label={dossier.derniereActivite} color={dossier.activiteColor} />
                                </td>

                                {/* Statut */}
                                <td className="px-4 py-4 text-center">
                                    <StatutBadge statut={dossier.statut} />
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 text-center">
                                    <ActionButton action={dossier.action} onShowDetail={() => openDrawer("ShowDetail")} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-6 sur {totalDossiers} business plans
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

export default TableDossiers;
