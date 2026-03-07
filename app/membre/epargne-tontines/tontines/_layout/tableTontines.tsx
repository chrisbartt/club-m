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
import { ChevronLeft, ChevronRight, Download, Filter, Megaphone, Pencil, Search, X as XIcon } from "lucide-react";
import { useState } from "react";

// Types
type StatutTontine = "active" | "a_risque" | "a_venir";

interface Tontine {
    id: string;
    nom: string;
    montantMois: number; // USD
    dureeMois: number;
    statut: StatutTontine;
    membresActuels: number;
    membresTotal: number;
    collecteMontant: number | null; // USD
    collectePourcent: number | null;
    ponctualite: number | null; // 0-100
}

// Statut Badge
const StatutBadge = ({ statut }: { statut: StatutTontine }) => {
    const config = {
        active: {
            label: "Active",
            dot: "bg-[#25a04f]",
            className: "bg-[#25a04f]/10 text-[#25a04f]",
        },
        a_risque: {
            label: "À risque",
            dot: "bg-[#e68b3c]",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
        },
        a_venir: {
            label: "À venir",
            dot: "bg-[#3a86ff]",
            className: "bg-[#3a86ff]/10 text-[#3a86ff]",
        },
    };
    const { label, dot, className } = config[statut];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {label}
        </span>
    );
};

// Barre de ponctualité
const BarrePonctualite = ({ statut, valeur }: { statut: StatutTontine; valeur: number | null }) => {
    if (valeur === null) return <span className="text-[13px] text-colorMuted">-</span>;
    const color = statut === "active" ? "bg-[#25a04f]" : "bg-[#e68b3c]";
    return (
        <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 h-2 bg-bgGray rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${Math.min(100, valeur)}%` }}
                />
            </div>
            <span className="text-[13px] font-medium text-colorTitle w-8">{valeur}%</span>
        </div>
    );
};

// Bouton + icône Actions selon statut
const ActionCell = ({ statut, onAction }: { statut: StatutTontine; onAction: () => void }) => {
    const config = {
        active: {
            label: "Gérer",
            btnClass: "bg-white border border-colorBorder text-colorTitle hover:bg-bgGray",
            icon: <Pencil size={14} className="text-[#e68b3c]" />,
        },
        a_risque: {
            label: "Intervenir",
            btnClass: "bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 border-0",
            icon: <Megaphone size={14} className="text-white" />,
        },
        a_venir: {
            label: "Inviter",
            btnClass: "bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90 border-0",
            icon: <Pencil size={14} className="text-white" />,
        },
    };
    const { label, btnClass, icon } = config[statut];
    return (
        <div className="flex items-center justify-center gap-2 w-full min-w-[180px]">
            <Button
                variant="outline"
                size="sm"
                onClick={onAction}
                className={`h-9 min-w-[100px] px-4 text-[12px] font-medium rounded-md shadow-none ${btnClass}`}
            >
                {label}
            </Button>
            <span className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                {statut !== "active" && (
                    <button
                        type="button"
                        onClick={onAction}
                        className="p-2 rounded-md hover:bg-bgGray transition-colors"
                        aria-label={label}
                    >
                        {icon}
                    </button>
                )}
            </span>
        </div>
    );
};

// Mock Data - Tontines
const mockTontines: Tontine[] = [
    {
        id: "1",
        nom: "Tontine Solidarité",
        montantMois: 50,
        dureeMois: 24,
        statut: "active",
        membresActuels: 24,
        membresTotal: 24,
        collecteMontant: 9600,
        collectePourcent: 33,
        ponctualite: 96,
    },
    {
        id: "2",
        nom: "Tontine Business Ladies",
        montantMois: 100,
        dureeMois: 24,
        statut: "a_risque",
        membresActuels: 22,
        membresTotal: 24,
        collecteMontant: 13200,
        collectePourcent: 25,
        ponctualite: 75,
    },
    {
        id: "3",
        nom: "Tontine Nouvelle Génération",
        montantMois: 100,
        dureeMois: 24,
        statut: "a_venir",
        membresActuels: 8,
        membresTotal: 24,
        collecteMontant: null,
        collectePourcent: null,
        ponctualite: null,
    },
];

interface Filters {
    statut: string;
    montant: string;
}

const defaultFilters: Filters = { statut: "tous", montant: "tous" };

const formatUSD = (n: number) => `$${n.toLocaleString("en-US")}`;

const TableTontines = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockTontines.filter((t) => {
        const matchSearch = !searchQuery || t.nom.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatut = filters.statut === "tous" || t.statut === filters.statut;
        const matchMontant =
            filters.montant === "tous" ||
            (filters.montant === "200" ? t.montantMois >= 200 : String(t.montantMois) === filters.montant);
        return matchSearch && matchStatut && matchMontant;
    });

    const totalTontines = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalTontines / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    const handleAction = (tontine: Tontine) => {
        // Ouvrir détail / drawer selon besoin
    };

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Tontines</h3>
                    <span className="text-[14px] text-colorMuted">({totalTontines})</span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end gap-3">
                    <div className="relative w-full max-w-[250px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher une tontine..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-bgCard dark:bg-transparent border-colorBorder text-[13px] placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-10 px-4 border-colorBorder text-colorTitle hover:bg-bgGray gap-2 shadow-none dark:bg-bgCard dark:border-colorBorder"
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filtrer</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[360px] p-5" align="end">
                            <div className="mb-5">
                                <h4 className="text-[12px] font-semibold text-bgSidebar uppercase tracking-wide mb-3">
                                    Filtres
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Statut</label>
                                        <Select value={filters.statut} onValueChange={(v) => handleFilterChange("statut", v)}>
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Tous statuts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous statuts</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="a_risque">À risque</SelectItem>
                                                <SelectItem value="a_venir">À venir</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Montant</label>
                                        <Select value={filters.montant} onValueChange={(v) => handleFilterChange("montant", v)}>
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Tous montants" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous montants</SelectItem>
                                                <SelectItem value="50">50 USD/mois</SelectItem>
                                                <SelectItem value="100">100 USD/mois</SelectItem>
                                                <SelectItem value="150">150 USD/mois</SelectItem>
                                                <SelectItem value="200">200 USD/mois et +</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
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

                    <Button className="h-10 px-4 bg-bgSidebar text-white hover:bg-bgSidebar/90 gap-2 shadow-none cursor-pointer dark:bg-bgGray">
                        <Download size={16} />
                        <span className="hidden sm:inline">Exporter</span>
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-y border-colorBorder bg-bgGray/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Nom
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Membres
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Collecté
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Ponctualité
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
                        {filtered.map((tontine) => (
                            <tr
                                key={tontine.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-[14px] font-semibold text-colorTitle">{tontine.nom}</p>
                                        <p className="text-[12px] text-colorMuted">
                                            {tontine.montantMois} USD/mois • {tontine.dureeMois} mois
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[13px] font-medium text-colorTitle">
                                        {tontine.membresActuels}/{tontine.membresTotal}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {tontine.collecteMontant != null && tontine.collectePourcent != null ? (
                                        <span className="text-[13px] text-colorTitle">
                                            {formatUSD(tontine.collecteMontant)}{" "}
                                            <span className="text-colorMuted">({tontine.collectePourcent}%)</span>
                                        </span>
                                    ) : (
                                        <span className="text-[13px] text-colorMuted">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <BarrePonctualite statut={tontine.statut} valeur={tontine.ponctualite} />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center">
                                        <StatutBadge statut={tontine.statut} />
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <ActionCell statut={tontine.statut} onAction={() => handleAction(tontine)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalTontines} sur {totalTontines} tontines
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

export default TableTontines;
