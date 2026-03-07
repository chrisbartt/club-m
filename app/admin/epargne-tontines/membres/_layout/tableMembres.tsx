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
import { AlertTriangle, ChevronLeft, ChevronRight, Download, Filter, MessageCircle, Search, Star, XCircle, X as XIcon } from "lucide-react";
import { useState } from "react";

// Types
type StatutMembre = "fiable" | "a_surveiller" | "risque";

interface Membre {
    id: string;
    initiales: string;
    nom: string;
    email: string;
    avatarColor: string;
    nbTontines: number;
    ponctualite: number; // 0-100
    score: number; // 0-100
    statut: StatutMembre;
}

// Statut Badge (Fiable / À surveiller / Risque)
const StatutBadge = ({ statut }: { statut: StatutMembre }) => {
    const config = {
        fiable: {
            label: "Fiable",
            className: "bg-[#25a04f]/10 text-[#25a04f]",
            icon: <Star size={12} className="fill-[#25a04f] text-[#25a04f]" />,
        },
        a_surveiller: {
            label: "À surveiller",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
            icon: <AlertTriangle size={12} />,
        },
        risque: {
            label: "Risque",
            className: "bg-[#dd3d3d]/10 text-[#dd3d3d]",
            icon: <XCircle size={12} />,
        },
    };
    const { label, className, icon } = config[statut];
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${className}`}>
            {icon}
            {label}
        </span>
    );
};

// Barre de ponctualité (couleur selon valeur)
const BarrePonctualite = ({ valeur }: { valeur: number }) => {
    const color =
        valeur >= 85 ? "bg-[#25a04f]" : valeur >= 65 ? "bg-[#e68b3c]" : "bg-[#dd3d3d]";
    return (
        <div className="flex items-center gap-2 min-w-[100px]">
            <div className="flex-1 h-[6px] bg-bgGray rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${color}`}
                    style={{ width: `${Math.min(100, valeur)}%` }}
                />
            </div>
            <span className="text-[13px] font-medium text-colorTitle w-9">{valeur}%</span>
        </div>
    );
};

// Score Badge (couleur selon valeur: vert / jaune / rouge)
const ScoreBadge = ({ score }: { score: number }) => {
    const color =
        score >= 85
            ? "bg-[#25a04f]/10 text-[#25a04f]"
            : score >= 65
                ? "bg-[#e68b3c]/10 text-[#e68b3c]"
                : "bg-[#dd3d3d]/10 text-[#dd3d3d]";
    return (
        <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2.5 py-1 rounded-full text-[12px] font-semibold ${color}`}>
            {score}
        </span>
    );
};

// Actions: Profil ou Action (rouge) + bouton message (bulle) — apparence message identique partout (comme 1re ligne)
const ActionCell = ({ statut, onProfil, onMessage }: { statut: StatutMembre; onProfil: () => void; onMessage: () => void }) => {
    const isRisque = statut === "risque";

    return (
        <div className="flex items-center justify-end gap-2 w-full min-w-[140px]">
            <Button
                variant="outline"
                size="sm"
                onClick={onProfil}
                className={
                    isRisque
                        ? "h-9 px-4 text-[12px] font-medium rounded-md shadow-none bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 border-0 cursor-pointer"
                        : "h-9 px-4 text-[12px] font-medium rounded-md shadow-none bg-white border border-colorBorder text-colorTitle hover:bg-bgGray cursor-pointer"
                }
            >
                {isRisque ? "Action" : "Profil"}
            </Button>
            <button
                type="button"
                onClick={onMessage}
                className="w-9 h-9 flex items-center justify-center rounded-md transition-colors bg-gray-200/80 hover:bg-gray-300 text-colorMuted cursor-pointer"
                aria-label="Message"
            >
                <MessageCircle size={16} />
            </button>
        </div>
    );
};

// Mock Data - Membres
const mockMembres: Membre[] = [
    {
        id: "1",
        initiales: "MK",
        nom: "Marie Kamba",
        email: "marie.k@email.com",
        avatarColor: "bg-[#25a04f]",
        nbTontines: 3,
        ponctualite: 98,
        score: 98,
        statut: "fiable",
    },
    {
        id: "2",
        initiales: "CB",
        nom: "Celine Banza",
        email: "celine.b@email.com",
        avatarColor: "bg-[#e68b3c]",
        nbTontines: 2,
        ponctualite: 78,
        score: 78,
        statut: "a_surveiller",
    },
    {
        id: "3",
        initiales: "FT",
        nom: "Flora Tshimanga",
        email: "flora.t@email.com",
        avatarColor: "bg-[#dd3d3d]",
        nbTontines: 1,
        ponctualite: 58,
        score: 58,
        statut: "risque",
    },
];

interface Filters {
    statut: string;
}

const defaultFilters: Filters = { statut: "tous" };

const TableMembres = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockMembres.filter((m) => {
        const matchSearch =
            !searchQuery ||
            m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatut = filters.statut === "tous" || m.statut === filters.statut;
        return matchSearch && matchStatut;
    });

    const totalMembres = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalMembres / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    const handleProfil = (membre: Membre) => {
        // Ouvrir profil membre
    };

    const handleMessage = (membre: Membre) => {
        // Ouvrir message / conversation
    };

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Membres</h3>
                    <span className="text-[14px] text-colorMuted">({totalMembres})</span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end gap-3">
                    <div className="relative w-full max-w-[250px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher un membre..."
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
                                        <label className="text-[11px] font-medium text-colorMuted">Statut</label>
                                        <Select value={filters.statut} onValueChange={(v) => handleFilterChange("statut", v)}>
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Tous statuts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous statuts</SelectItem>
                                                <SelectItem value="fiable">Fiable</SelectItem>
                                                <SelectItem value="a_surveiller">À surveiller</SelectItem>
                                                <SelectItem value="risque">Risque</SelectItem>
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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-y border-colorBorder bg-bgGray/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Membre
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Tontines
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Ponctualité
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Score
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Statut
                            </th>
                            <th className="text-right text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((membre) => (
                            <tr
                                key={membre.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold flex-shrink-0 ${membre.avatarColor}`}
                                        >
                                            {membre.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-colorTitle">{membre.nom}</p>
                                            <p className="text-[12px] text-colorMuted">{membre.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[13px] font-medium text-colorTitle">{membre.nbTontines}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-center">
                                        <BarrePonctualite valeur={membre.ponctualite} />
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <ScoreBadge score={membre.score} />
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <StatutBadge statut={membre.statut} />
                                </td>
                                <td className="px-6 py-4">
                                    <ActionCell
                                        statut={membre.statut}
                                        onProfil={() => handleProfil(membre)}
                                        onMessage={() => handleMessage(membre)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalMembres} sur {totalMembres} membres
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

export default TableMembres;
