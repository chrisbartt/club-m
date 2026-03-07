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
type MotifLitige = "non_conformite" | "retard_livraison" | "communication";
type PrioriteLitige = "urgent" | "moyen" | "normal";

interface Litige {
    id: string;
    numeroLitige: string;
    commande: string;
    client: string;
    clientInitiales: string;
    clientAvatarColor: string;
    prestatatoire: string;
    prestatatoireInitiales: string;
    prestatatoireAvatarColor: string;
    motif: MotifLitige;
    montantBloque: string;
    ouvertLe: string;
    priorite: PrioriteLitige;
}

// Badge motif (Non-conformité, Retard livraison, Communication)
const MotifBadge = ({ motif }: { motif: MotifLitige }) => {
    const config: Record<MotifLitige, { label: string; className: string }> = {
        non_conformite: {
            label: "Non-conformité",
            className: "bg-[#dd3d3d]/10 text-[#dd3d3d]",
        },
        retard_livraison: {
            label: "Retard livraison",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
        },
        communication: {
            label: "Communication",
            className: "bg-[#3a86ff]/10 text-[#3a86ff]",
        },
    };
    const { label, className } = config[motif];
    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${className}`}
        >
            {label}
        </span>
    );
};

// Badge priorité (Urgent, Moyen, Normal) avec point — fond light
const PrioriteBadge = ({ priorite }: { priorite: PrioriteLitige }) => {
    const config: Record<
        PrioriteLitige,
        { label: string; dotClass: string; badgeClass: string }
    > = {
        urgent: {
            label: "Urgent",
            dotClass: "bg-[#dd3d3d]",
            badgeClass: "bg-[#dd3d3d]/10 text-[#dd3d3d]",
        },
        moyen: {
            label: "Moyen",
            dotClass: "bg-[#e68b3c]",
            badgeClass: "bg-[#e68b3c]/10 text-[#e68b3c]",
        },
        normal: {
            label: "Normal",
            dotClass: "bg-[#3a86ff]",
            badgeClass: "bg-[#3a86ff]/10 text-[#3a86ff]",
        },
    };
    const { label, dotClass, badgeClass } = config[priorite];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${badgeClass}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
            {label}
        </span>
    );
};

// Actions : Arbitrer (rouge ou orange selon priorité) ou Voir (outline) — ouvrent ShowLitige
const ActionCell = ({
    priorite,
    onArbitrer,
    onVoir,
}: {
    priorite: PrioriteLitige;
    onArbitrer: () => void;
    onVoir: () => void;
}) => {
    const isUrgent = priorite === "urgent";
    const isMoyen = priorite === "moyen";
    const showArbitrer = isUrgent || isMoyen;

    return (
        <div className="flex items-center justify-end gap-2 w-full min-w-[120px]">
            {showArbitrer ? (
                <Button
                    size="sm"
                    onClick={onArbitrer}
                    className={`h-9 px-4 rounded-md shadow-none text-white cursor-pointer text-[13px] ${isUrgent
                        ? "bg-[#dd3d3d] hover:bg-[#dd3d3d]/90"
                        : "bg-[#e68b3c] hover:bg-[#e68b3c]/90"
                        }`}
                >
                    Arbitrer
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onVoir}
                    className="h-9 px-4 rounded-md shadow-none bg-white border border-colorBorder text-colorTitle hover:bg-bgGray cursor-pointer text-[13px]"
                >
                    Voir
                </Button>
            )}
        </div>
    );
};

// Mock Data - Litiges en cours (maquette)
const mockLitiges: Litige[] = [
    {
        id: "1",
        numeroLitige: "LIT-0089",
        commande: "CMD-0456",
        client: "Sophie M. (client)",
        clientInitiales: "SM",
        clientAvatarColor: "bg-[#dd3d3d]",
        prestatatoire: "Keza Consulting",
        prestatatoireInitiales: "KC",
        prestatatoireAvatarColor: "bg-[#3a86ff]",
        motif: "non_conformite",
        montantBloque: "$200",
        ouvertLe: "12 Mars",
        priorite: "urgent",
    },
    {
        id: "2",
        numeroLitige: "LIT-0088",
        commande: "CMD-0449",
        client: "Ruth L. (client)",
        clientInitiales: "RL",
        clientAvatarColor: "bg-[#8c49b1]",
        prestatatoire: "Créa Studio",
        prestatatoireInitiales: "CS",
        prestatatoireAvatarColor: "bg-[#b58b72]",
        motif: "retard_livraison",
        montantBloque: "$350",
        ouvertLe: "10 Mars",
        priorite: "moyen",
    },
    {
        id: "3",
        numeroLitige: "LIT-0087",
        commande: "CMD-0445",
        client: "Grace K. (client)",
        clientInitiales: "GK",
        clientAvatarColor: "bg-[#25a04f]",
        prestatatoire: "Digital Boost",
        prestatatoireInitiales: "DB",
        prestatatoireAvatarColor: "bg-[#e68b3c]",
        motif: "communication",
        montantBloque: "$300",
        ouvertLe: "8 Mars",
        priorite: "normal",
    },
];

interface Filters {
    priorite: string;
    motif: string;
}

const defaultFilters: Filters = { priorite: "tous", motif: "tous" };

const TableLitigeEncours = () => {
    const { openDrawer } = useDrawer();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockLitiges.filter((l) => {
        const matchSearch =
            !searchQuery ||
            l.numeroLitige.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.commande.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.prestatatoire.toLowerCase().includes(searchQuery.toLowerCase());
        const matchPriorite =
            filters.priorite === "tous" || l.priorite === filters.priorite;
        const matchMotif =
            filters.motif === "tous" || l.motif === filters.motif;
        return matchSearch && matchPriorite && matchMotif;
    });

    const totalLitiges = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalLitiges / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    const openShowLitige = (litige: Litige) => {
        openDrawer("ShowLitige", {
            id: litige.id,
            numeroLitige: litige.numeroLitige,
            client: litige.client,
            prestatatoire: litige.prestatatoire,
            date: litige.ouvertLe,
            montantBloque: litige.montantBloque,
            commande: litige.commande,
            motif: litige.motif,
            priorite: litige.priorite,
            ouvertLe: litige.ouvertLe,
            clientInitiales: litige.clientInitiales,
            clientAvatarColor: litige.clientAvatarColor,
            prestatatoireInitiales: litige.prestatatoireInitiales,
            prestatatoireAvatarColor: litige.prestatatoireAvatarColor,
        });
    };

    const getRowClassName = () =>
        "border-b border-colorBorder last:border-b-0 transition-colors duration-200 hover:bg-bgGray/30";

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between md:gap-4 gap-3 px-5 md:px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle flex items-center gap-2">
                        Litiges en cours
                    </h3>
                    <span className="text-[14px] text-colorMuted">
                        ({totalLitiges})
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
                            placeholder="Rechercher un litige..."
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
                                            Priorité
                                        </label>
                                        <Select
                                            value={filters.priorite}
                                            onValueChange={(v) =>
                                                handleFilterChange("priorite", v)
                                            }
                                        >
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Toutes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">
                                                    Toutes
                                                </SelectItem>
                                                <SelectItem value="urgent">
                                                    Urgent
                                                </SelectItem>
                                                <SelectItem value="moyen">
                                                    Moyen
                                                </SelectItem>
                                                <SelectItem value="normal">
                                                    Normal
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">
                                            Motif
                                        </label>
                                        <Select
                                            value={filters.motif}
                                            onValueChange={(v) =>
                                                handleFilterChange("motif", v)
                                            }
                                        >
                                            <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">
                                                    Tous
                                                </SelectItem>
                                                <SelectItem value="non_conformite">
                                                    Non-conformité
                                                </SelectItem>
                                                <SelectItem value="retard_livraison">
                                                    Retard livraison
                                                </SelectItem>
                                                <SelectItem value="communication">
                                                    Communication
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
                                N° Litige
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Commande
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Parties
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Motif
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Montant bloqué
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Ouvert le
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Priorité
                            </th>
                            <th className="text-right text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((litige) => (
                            <tr
                                key={litige.id}
                                className={getRowClassName()}
                            >
                                <td className="px-6 py-4 text-[14px] font-medium text-colorTitle">
                                    {litige.numeroLitige}
                                </td>
                                <td className="px-4 py-4 text-[14px] text-colorTitle">
                                    {litige.commande}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0 ${litige.clientAvatarColor}`}
                                        >
                                            {litige.clientInitiales}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[14px] font-semibold text-colorTitle leading-tight">
                                                {litige.client}
                                            </span>
                                            <span className="text-[13px] text-colorMuted leading-tight">
                                                {litige.prestatatoire}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-center">
                                        <MotifBadge motif={litige.motif} />
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center text-[14px] font-semibold text-[#dd3d3d]">
                                    {litige.montantBloque}
                                </td>
                                <td className="px-4 py-4 text-center text-[14px] text-colorTitle">
                                    {litige.ouvertLe}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-center">
                                        <PrioriteBadge priorite={litige.priorite} />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <ActionCell
                                        priorite={litige.priorite}
                                        onArbitrer={() => openShowLitige(litige)}
                                        onVoir={() => openShowLitige(litige)}
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
                    Affichage 1-{totalLitiges} sur {totalLitiges} litiges
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

export default TableLitigeEncours;
