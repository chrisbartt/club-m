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
import { useDialog } from '@/context/dialog-context';
import { useDrawer } from '@/context/drawer-context';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    Pause,
    Search,
    Star,
    X as XIcon,
} from "lucide-react";
import { useState } from "react";

// Types
type Categorie = "Conseil" | "Marketing" | "Finance" | "Design";
type StatutMembre = "actif" | "sous_surveillance";

interface Membre {
    id: string;
    initiales: string;
    nom: string;
    business: string;
    avatarColor: string;
    categorie: Categorie;
    nbServicesActifs: number;
    nbCommandes: number;
    caGenere: string;
    score: number;
    statut: StatutMembre;
}

// Badge catégorie (Conseil, Marketing, Finance, Design)
const CategorieBadge = ({ categorie }: { categorie: Categorie }) => {
    const config: Record<Categorie, string> = {
        Conseil: "bg-[#FFF8EB] text-[#e68b3c]",
        Marketing: "bg-[#E8F0FE] text-[#3a86ff]",
        Finance: "bg-[#F3E8FF] text-[#8c49b1]",
        Design: "bg-[#FEF9E7] text-[#b58b72]",
    };
    const badgeClass = config[categorie];
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-medium ${badgeClass}`}
        >
            {categorie}
        </span>
    );
};

// Statut Badge (Actif / Sous surveillance)
const StatutBadge = ({ statut }: { statut: StatutMembre }) => {
    const config = {
        actif: {
            label: "Actif",
            className: "bg-[#25a04f]/10 text-[#25a04f]",
        },
        sous_surveillance: {
            label: "Sous surveillance",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
        },
    };
    const { label, className } = config[statut];
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${className}`}
        >
            {label}
        </span>
    );
};

// Score : étoile jaune + nombre (vert si ≥ 4, orange sinon)
const ScoreCell = ({ score }: { score: number }) => {
    const isHigh = score >= 4;
    const colorClass = isHigh ? "text-[#25a04f]" : "text-[#e68b3c]";
    return (
        <div className="flex items-center justify-center gap-1.5">
            <Star size={16} className="fill-amber-400 text-amber-400 shrink-0" />
            <span className={`text-[13px] font-semibold ${colorClass}`}>
                {score.toFixed(1)}
            </span>
        </div>
    );
};

// Actions : œil (outline) + pause (outline ou rouge si sous surveillance)
const ActionCell = ({
    statut,
    onVoir,
    onPause,
}: {
    statut: StatutMembre;
    onVoir: () => void;
    onPause: () => void;
}) => {
    const isSurveillance = statut === "sous_surveillance";

    return (
        <div className="flex items-center justify-end gap-2 w-full min-w-[100px]">
            <Button
                variant="outline"
                size="icon"
                onClick={onVoir}
                className="h-9 w-9 rounded-md shadow-none bg-white border border-colorBorder text-colorTitle hover:bg-bgGray cursor-pointer"
                aria-label="Voir"
            >
                <Eye size={16} />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={onPause}
                className={
                    isSurveillance
                        ? "h-9 w-9 rounded-md shadow-none bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 border-0 cursor-pointer"
                        : "h-9 w-9 rounded-md shadow-none bg-white border border-colorBorder text-colorTitle hover:bg-bgGray cursor-pointer"
                }
                aria-label="Pause"
            >
                <Pause size={16} className={isSurveillance ? "text-white" : ""} />
            </Button>
        </div>
    );
};

// Mock Data - Membres / Business (maquette)
const mockMembres: Membre[] = [
    {
        id: "1",
        initiales: "MK",
        nom: "Marie Kamba",
        business: "Keza Consulting",
        avatarColor: "bg-[#3a86ff]",
        categorie: "Conseil",
        nbServicesActifs: 3,
        nbCommandes: 24,
        caGenere: "$3,450",
        score: 4.9,
        statut: "actif",
    },
    {
        id: "2",
        initiales: "GL",
        nom: "Grace Luma",
        business: "Digital Boost",
        avatarColor: "bg-[#25a04f]",
        categorie: "Marketing",
        nbServicesActifs: 5,
        nbCommandes: 18,
        caGenere: "$2,890",
        score: 4.7,
        statut: "actif",
    },
    {
        id: "3",
        initiales: "RM",
        nom: "Ruth Mbeki",
        business: "Finance Pro",
        avatarColor: "bg-[#8c49b1]",
        categorie: "Finance",
        nbServicesActifs: 2,
        nbCommandes: 12,
        caGenere: "$1,650",
        score: 4.8,
        statut: "actif",
    },
    {
        id: "4",
        initiales: "FT",
        nom: "Flora Tshala",
        business: "Créa Studio",
        avatarColor: "bg-[#b58b72]",
        categorie: "Design",
        nbServicesActifs: 4,
        nbCommandes: 8,
        caGenere: "$920",
        score: 3.2,
        statut: "sous_surveillance",
    },
];

interface Filters {
    statut: string;
    categorie: string;
}

const defaultFilters: Filters = { statut: "tous", categorie: "tous" };

const TableMembres = () => {
    const { openDialog } = useDialog();
    const { openDrawer } = useDrawer();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockMembres.filter((m) => {
        const matchSearch =
            !searchQuery ||
            m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.business.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatut =
            filters.statut === "tous" || m.statut === filters.statut;
        const matchCategorie =
            filters.categorie === "tous" || m.categorie === filters.categorie;
        return matchSearch && matchStatut && matchCategorie;
    });

    const totalMembres = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalMembres / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    const handleVoir = (membre: Membre) => {
        void membre;
        openDrawer("ShowMembre");
    };

    const handlePause = (membre: Membre) => {
        void membre;
        openDialog("suspendMembreDialog");
    };

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between md:gap-4 gap-3 px-5 md:px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">
                        Membres
                    </h3>
                    <span className="text-[14px] text-colorMuted">
                        ({totalMembres})
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
                            placeholder="Rechercher un membre..."
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
                                                <SelectValue placeholder="Tous statuts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">
                                                    Tous statuts
                                                </SelectItem>
                                                <SelectItem value="actif">
                                                    Actif
                                                </SelectItem>
                                                <SelectItem value="sous_surveillance">
                                                    Sous surveillance
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">
                                            Catégorie
                                        </label>
                                        <Select
                                            value={filters.categorie}
                                            onValueChange={(v) =>
                                                handleFilterChange("categorie", v)
                                            }
                                        >
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Toutes catégories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">
                                                    Toutes catégories
                                                </SelectItem>
                                                <SelectItem value="Conseil">
                                                    Conseil
                                                </SelectItem>
                                                <SelectItem value="Marketing">
                                                    Marketing
                                                </SelectItem>
                                                <SelectItem value="Finance">
                                                    Finance
                                                </SelectItem>
                                                <SelectItem value="Design">
                                                    Design
                                                </SelectItem>
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

                    <Button className="h-10 px-4 bg-bgSidebar text-white hover:bg-bgSidebar/90 gap-2 shadow-none cursor-pointer">
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
                                Membre / Business
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Catégorie
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Services
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Commandes
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                CA généré
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
                                className="border-b border-colorBorder last:border-b-0 transition-colors duration-200 hover:bg-bgGray/30"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0 ${membre.avatarColor}`}
                                        >
                                            {membre.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-colorTitle">
                                                {membre.nom}
                                            </p>
                                            <p className="text-[12px] text-colorMuted">
                                                {membre.business}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <div className="flex justify-center">
                                        <CategorieBadge
                                            categorie={membre.categorie}
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[13px] font-semibold text-colorTitle">
                                        {membre.nbServicesActifs} actifs
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[13px] font-semibold text-colorTitle">
                                        {membre.nbCommandes}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[13px] font-semibold text-colorTitle">
                                        {membre.caGenere}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <ScoreCell score={membre.score} />
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <StatutBadge statut={membre.statut} />
                                </td>
                                <td className="px-6 py-4">
                                    <ActionCell
                                        statut={membre.statut}
                                        onVoir={() => handleVoir(membre)}
                                        onPause={() => handlePause(membre)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder flex-col md:flex-row gap-2">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalMembres} sur {totalMembres} membres
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

export default TableMembres;
