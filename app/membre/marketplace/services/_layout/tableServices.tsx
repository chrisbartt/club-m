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
import { useDialog } from "@/context/dialog/contextDialog";
import { useDrawer } from "@/context/drawer/contextDrawer";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Filter,
    Search,
    Star,
    X as XIcon
} from "lucide-react";
import { useState } from "react";

// Types
type StatutService = "actif" | "brouillon" | "suspendu";

interface Service {
    id: string;
    nomService: string;
    categorie: string;
    prestatatoire: string;
    initiales: string;
    avatarColor: string;
    prix: string;
    commandes: number;
    note: number;
    statut: StatutService;
}

// Badge statut (Actif)
const StatutBadge = ({ statut }: { statut: StatutService }) => {
    const config: Record<StatutService, { label: string; className: string }> = {
        actif: { label: "Actif", className: "bg-[#25a04f]/10 text-[#25a04f]" },
        brouillon: { label: "Brouillon", className: "bg-gray-200 text-gray-600" },
        suspendu: { label: "Suspendu", className: "bg-[#dd3d3d]/10 text-[#dd3d3d]" },
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

// Note : étoile jaune + nombre (vert #25a04f)
const NoteCell = ({ note }: { note: number }) => (
    <div className="flex items-center justify-center gap-1.5">
        <Star size={16} className="fill-amber-400 text-amber-400 shrink-0" />
        <span className="text-[13px] font-semibold text-[#25a04f]">
            {note.toFixed(1)}
        </span>
    </div>
);

// Actions : Voir + Suspendre (boutons outline avec texte)
const ActionCell = ({
    onVoir,
    onSuspendre,
}: {
    onVoir: () => void;
    onSuspendre: () => void;
}) => (
    <div className="flex items-center justify-end gap-2 w-full min-w-[160px]">
        <Button
            variant="outline"
            size="sm"
            onClick={onVoir}
            className="h-9 px-4 rounded-md shadow-none bg-white border border-colorBorder text-colorTitle hover:bg-bgGray cursor-pointer text-[13px]"
        >
            Voir
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={onSuspendre}
            className="h-9 px-4 rounded-md shadow-none bg-white border border-colorBorder text-colorTitle hover:bg-bgGray cursor-pointer text-[13px]"
        >
            Suspendre
        </Button>
    </div>
);

// Mock Data - Services (maquette)
const mockServices: Service[] = [
    {
        id: "1",
        nomService: "Accompagnement Business Plan",
        categorie: "Conseil & Stratégie",
        prestatatoire: "Keza Consulting",
        initiales: "KC",
        avatarColor: "bg-[#3a86ff]",
        prix: "$150",
        commandes: 12,
        note: 4.9,
        statut: "actif",
    },
    {
        id: "2",
        nomService: "Formation Leadership Féminin",
        categorie: "Formation",
        prestatatoire: "Keza Consulting",
        initiales: "KC",
        avatarColor: "bg-[#3a86ff]",
        prix: "$300",
        commandes: 8,
        note: 4.8,
        statut: "actif",
    },
    {
        id: "3",
        nomService: "Stratégie Marketing Digital",
        categorie: "Marketing",
        prestatatoire: "Digital Boost",
        initiales: "DB",
        avatarColor: "bg-[#25a04f]",
        prix: "$250",
        commandes: 15,
        note: 4.7,
        statut: "actif",
    },
];

interface Filters {
    statut: string;
    categorie: string;
}

const defaultFilters: Filters = { statut: "tous", categorie: "tous" };

const TableServices = () => {
    const { openDialog } = useDialog();
    const { openDrawer } = useDrawer();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockServices.filter((s) => {
        const matchSearch =
            !searchQuery ||
            s.nomService.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.prestatatoire.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.categorie.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatut =
            filters.statut === "tous" || s.statut === filters.statut;
        const matchCategorie =
            filters.categorie === "tous" || s.categorie === filters.categorie;
        return matchSearch && matchStatut && matchCategorie;
    });

    const totalServices = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalServices / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    const handleVoir = (service: Service) => {
        void service;
        openDrawer("ShowMembre");
    };

    const handleSuspendre = (service: Service) => {
        void service;
        openDialog("coachingDialog");
    };

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">
                        Services
                    </h3>
                    <span className="text-[14px] text-colorMuted">
                        ({totalServices})
                    </span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end gap-3">
                    <div className="relative w-full max-w-[250px]">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted"
                        />
                        <Input
                            type="text"
                            placeholder="Rechercher un service..."
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
                                type="button"
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
                                                <SelectItem value="brouillon">
                                                    Brouillon
                                                </SelectItem>
                                                <SelectItem value="suspendu">
                                                    Suspendu
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
                                                <SelectItem value="Conseil & Stratégie">
                                                    Conseil & Stratégie
                                                </SelectItem>
                                                <SelectItem value="Formation">
                                                    Formation
                                                </SelectItem>
                                                <SelectItem value="Marketing">
                                                    Marketing
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
                                Service
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Prestataire
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Prix
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Commandes
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Note
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
                        {filtered.map((service) => (
                            <tr
                                key={service.id}
                                className="border-b border-colorBorder last:border-b-0 transition-colors duration-200 hover:bg-bgGray/30"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-[14px] font-semibold text-colorTitle">
                                            {service.nomService}
                                        </p>
                                        <p className="text-[12px] text-colorMuted">
                                            {service.categorie}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0 ${service.avatarColor}`}
                                        >
                                            {service.initiales}
                                        </div>
                                        <span className="text-[14px] text-colorTitle">
                                            {service.prestatatoire}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[14px] font-semibold text-colorTitle">
                                        {service.prix}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[14px] text-colorTitle">
                                        {service.commandes}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <NoteCell note={service.note} />
                                </td>
                                <td className="px-4 py-4 text-center">
                                    <div className="flex justify-center">
                                        <StatutBadge statut={service.statut} />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <ActionCell
                                        onVoir={() => handleVoir(service)}
                                        onSuspendre={() =>
                                            handleSuspendre(service)
                                        }
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
                    Affichage 1-{totalServices} sur {totalServices} services
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

export default TableServices;
