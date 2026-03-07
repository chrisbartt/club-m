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
import { Check, ChevronLeft, ChevronRight, Download, Filter, Search, X as XIcon } from "lucide-react";
import { useState } from "react";

// Types
type ProfilDemande = "nouveau" | "score";

interface Demande {
    id: string;
    initiales: string;
    nom: string;
    email: string;
    avatarColor: string;
    tontine: string;
    date: string; // ex: "23 Mars"
    profil: ProfilDemande;
    score?: number; // si profil === "score"
}

// Badge Profil : "Nouveau" (bleu) ou "Score XX" (vert)
const ProfilBadge = ({ profil, score }: { profil: ProfilDemande; score?: number }) => {
    if (profil === "nouveau") {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-medium bg-[#3a86ff]/10 text-[#3a86ff]">
                Nouveau
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
            Score {score ?? 0}
        </span>
    );
};

// Actions : Accepter (vert check) + Refuser (rouge X)
const ActionButtons = ({
    onAccept,
    onReject,
}: {
    onAccept: () => void;
    onReject: () => void;
}) => (
    <div className="flex items-center justify-end gap-2">
        <button
            type="button"
            onClick={onAccept}
            className="w-9 h-9 rounded-lg bg-[#25a04f] text-white flex items-center justify-center hover:bg-[#25a04f]/90 transition-colors cursor-pointer"
            aria-label="Accepter"
        >
            <Check size={18} />
        </button>
        <button
            type="button"
            onClick={onReject}
            className="w-9 h-9 rounded-lg bg-[#dd3d3d] text-white flex items-center justify-center hover:bg-[#dd3d3d]/90 transition-colors cursor-pointer"
            aria-label="Refuser"
        >
            <XIcon size={18} />
        </button>
    </div>
);

// Mock Data - Demandes
const mockDemandes: Demande[] = [
    {
        id: "1",
        initiales: "AL",
        nom: "Anne Lukusa",
        email: "anne.l@email.com",
        avatarColor: "bg-[#3a86ff]",
        tontine: "Tontine Entraide",
        date: "23 Mars",
        profil: "nouveau",
    },
    {
        id: "2",
        initiales: "BM",
        nom: "Béatrice Mwamba",
        email: "beatrice.m@email.com",
        avatarColor: "bg-[#25a04f]",
        tontine: "Business Ladies",
        date: "22 Mars",
        profil: "score",
        score: 88,
    },
];

interface Filters {
    profil: string;
    tontine: string;
}

const defaultFilters: Filters = { profil: "tous", tontine: "tous" };

const TableDemandes = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockDemandes.filter((d) => {
        const matchSearch =
            !searchQuery ||
            d.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.tontine.toLowerCase().includes(searchQuery.toLowerCase());
        const matchProfil = filters.profil === "tous" || d.profil === filters.profil;
        const matchTontine = filters.tontine === "tous" || d.tontine === filters.tontine;
        return matchSearch && matchProfil && matchTontine;
    });

    const totalDemandes = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalDemandes / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    const handleAccept = (demande: Demande) => {
        void demande;
        // TODO: accepter la demande (API)
    };

    const handleReject = (demande: Demande) => {
        void demande;
        // TODO: refuser la demande (API)
    };

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Demandes</h3>
                    <span className="text-[14px] text-colorMuted">({totalDemandes})</span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end gap-3">
                    <div className="relative w-full max-w-[250px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher une demande..."
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
                                        <label className="text-[11px] font-medium text-colorMuted">Profil</label>
                                        <Select value={filters.profil} onValueChange={(v) => handleFilterChange("profil", v)}>
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="nouveau">Nouveau</SelectItem>
                                                <SelectItem value="score">Avec score</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Tontine</label>
                                        <Select value={filters.tontine} onValueChange={(v) => handleFilterChange("tontine", v)}>
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Toutes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Toutes</SelectItem>
                                                <SelectItem value="Tontine Entraide">Tontine Entraide</SelectItem>
                                                <SelectItem value="Business Ladies">Business Ladies</SelectItem>
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
                                Candidat
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Tontine
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Date
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Profil
                            </th>
                            <th className="text-right text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((demande) => (
                            <tr
                                key={demande.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0 ${demande.avatarColor}`}
                                        >
                                            {demande.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-colorTitle">{demande.nom}</p>
                                            <p className="text-[12px] text-colorMuted">{demande.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[13px] font-medium text-colorTitle">{demande.tontine}</span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[13px] text-colorTitle">{demande.date}</span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <ProfilBadge profil={demande.profil} score={demande.score} />
                                </td>
                                <td className="px-6 py-4">
                                    <ActionButtons
                                        onAccept={() => handleAccept(demande)}
                                        onReject={() => handleReject(demande)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalDemandes} sur {totalDemandes} demandes
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

export default TableDemandes;
