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
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Filter,
    Search,
    X as XIcon,
} from "lucide-react";
import { useState } from "react";

// Types
type StatutPaySeq = "en_attente_livraison" | "attente_validation";

interface PaiementSeq {
    id: string;
    commande: string;
    montant: string;
    prestatatoire: string;
    expiration: string;
    statut: StatutPaySeq;
}

// Badge statut (bleu pour En attente livraison, orange pour Attente validation)
const StatutBadge = ({ statut }: { statut: StatutPaySeq }) => {
    const config: Record<StatutPaySeq, { label: string; className: string }> = {
        en_attente_livraison: {
            label: "En attente livraison",
            className: "bg-[#3a86ff]/10 text-[#3a86ff]",
        },
        attente_validation: {
            label: "Attente validation",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
        },
    };
    const { label, className } = config[statut];
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium ${className}`}
        >
            {label}
        </span>
    );
};

// Mock Data - Paiements en séquestre (maquette)
const mockPaiementsSeq: PaiementSeq[] = [
    {
        id: "1",
        commande: "CMD-0467",
        montant: "$150",
        prestatatoire: "Keza Consulting",
        expiration: "En cours",
        statut: "en_attente_livraison",
    },
    {
        id: "2",
        commande: "CMD-0466",
        montant: "$300",
        prestatatoire: "Digital Boost",
        expiration: "Dans 36h",
        statut: "attente_validation",
    },
    {
        id: "3",
        commande: "CMD-0465",
        montant: "$200",
        prestatatoire: "Keza Consulting",
        expiration: "Dans 12h",
        statut: "attente_validation",
    },
];

interface Filters {
    statut: string;
}

const defaultFilters: Filters = { statut: "tous" };

const TablePaySeq = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockPaiementsSeq.filter((p) => {
        const matchSearch =
            !searchQuery ||
            p.commande.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.prestatatoire.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.montant.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatut =
            filters.statut === "tous" || p.statut === filters.statut;
        return matchSearch && matchStatut;
    });

    const totalPaiements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalPaiements / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    const getRowClassName = () =>
        "border-b border-colorBorder last:border-b-0 transition-colors duration-200 hover:bg-bgGray/30";

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between md:gap-4 gap-3 px-5 md:px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle flex items-center gap-2">
                        Paiements en séquestre
                    </h3>
                    <span className="text-[14px] text-colorMuted">
                        ({totalPaiements})
                    </span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end md:gap-3 gap-2">
                    <div className="relative w-full max-w-[250px]">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted"
                        />
                        <Input
                            type="text"
                            placeholder="Rechercher une commande..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-white border-colorBorder text-[13px] placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-10 px-4 border-colorBorder text-colorTitle hover:bg-bgGray gap-2 shadow-none cursor-pointer"
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
                                        <label className="text-[11px] font-medium text-colorMuted">
                                            Statut
                                        </label>
                                        <Select
                                            value={filters.statut}
                                            onValueChange={(v) =>
                                                handleFilterChange("statut", v)
                                            }
                                        >
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">
                                                    Tous
                                                </SelectItem>
                                                <SelectItem value="en_attente_livraison">
                                                    En attente livraison
                                                </SelectItem>
                                                <SelectItem value="attente_validation">
                                                    Attente validation
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end md:gap-3 gap-2 pt-3 border-t border-colorBorder">
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

                    <Button className="h-10 px-4 bg-bgSidebar text-white hover:bg-bgSidebar/90 gap-2 shadow-none cursor-pointer">
                        <Download size={16} />
                        <span className="hidden sm:inline">Exporter</span>
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="border-y border-colorBorder bg-gray-50/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Commande
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Montant
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Prestataire
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Expiration
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Statut
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p) => (
                            <tr key={p.id} className={getRowClassName()}>
                                <td className="px-6 py-4 text-[14px] font-medium text-colorTitle">
                                    {p.commande}
                                </td>
                                <td className="px-4 py-4 text-[14px] font-semibold text-colorTitle">
                                    {p.montant}
                                </td>
                                <td className="px-4 py-4 text-[14px] text-colorTitle">
                                    {p.prestatatoire}
                                </td>
                                <td className="px-4 py-4 text-[14px] text-colorTitle">
                                    {p.expiration}
                                </td>
                                <td className="px-6 py-4">
                                    <StatutBadge statut={p.statut} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder flex-col md:flex-row gap-2">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalPaiements} sur {totalPaiements} paiements
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-colorMuted hover:text-colorTitle disabled:opacity-50 transition-colors cursor-pointer"
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                        }
                    >
                        <ChevronLeft size={16} />
                        Précédent
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-colorTitle font-medium hover:text-bgSidebar disabled:opacity-50 transition-colors cursor-pointer"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            setCurrentPage((p) =>
                                Math.min(totalPages, p + 1)
                            )
                        }
                    >
                        Suivant
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TablePaySeq;
