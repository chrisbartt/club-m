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
type StatutCommande = "en_cours" | "livre" | "litige" | "valide";

interface Commande {
    id: string;
    numero: string;
    client: string;
    clientInitiales: string;
    clientAvatarColor: string;
    prestatatoire: string;
    service: string;
    montant: string;
    date: string;
    statut: StatutCommande;
}

// Badge statut commande (point coloré + libellé)
const StatutCommandeBadge = ({ statut }: { statut: StatutCommande }) => {
    const config: Record<
        StatutCommande,
        { label: string; dotClass: string; badgeClass: string }
    > = {
        en_cours: {
            label: "En cours",
            dotClass: "bg-[#3a86ff]",
            badgeClass: "bg-[#3a86ff]/10 text-[#3a86ff]",
        },
        livre: {
            label: "Livré",
            dotClass: "bg-[#8c49b1]",
            badgeClass: "bg-[#8c49b1]/10 text-[#8c49b1]",
        },
        litige: {
            label: "Litige",
            dotClass: "bg-[#dd3d3d]",
            badgeClass: "bg-[#dd3d3d]/10 text-[#dd3d3d]",
        },
        valide: {
            label: "Validé",
            dotClass: "bg-[#25a04f]",
            badgeClass: "bg-[#25a04f]/10 text-[#25a04f]",
        },
    };
    const { label, dotClass, badgeClass } = config[statut];
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${badgeClass}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
            {label}
        </span>
    );
};

// Actions : Détail (outline) + Traiter (rouge, uniquement si litige)
const ActionCell = ({
    statut,
    onDetail,
    onTraiter,
}: {
    statut: StatutCommande;
    onDetail: () => void;
    onTraiter: () => void;
}) => (
    <div className="flex items-center justify-end gap-2 w-full min-w-[140px]">
        <Button
            variant="outline"
            size="sm"
            onClick={onDetail}
            className="h-9 px-4 rounded-md shadow-none bg-white border border-colorBorder text-colorTitle hover:bg-bgGray cursor-pointer text-[13px]"
        >
            Détail
        </Button>
        {statut === "litige" && (
            <Button
                size="sm"
                onClick={onTraiter}
                className="h-9 px-4 rounded-md shadow-none bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 cursor-pointer text-[13px]"
            >
                Traiter
            </Button>
        )}
    </div>
);

// Mock Data - Commandes (maquette)
const mockCommandes: Commande[] = [
    {
        id: "1",
        numero: "CMD-0467",
        client: "Marie K.",
        clientInitiales: "MK",
        clientAvatarColor: "bg-[#3a86ff]",
        prestatatoire: "Keza Consulting",
        service: "Accompagnement BP",
        montant: "$150",
        date: "Aujourd'hui",
        statut: "valide",
    },
    {
        id: "2",
        numero: "CMD-0466",
        client: "Grace K.",
        clientInitiales: "GK",
        clientAvatarColor: "bg-[#e68b3c]",
        prestatatoire: "Keza Consulting",
        service: "Stratégie Marketing",
        montant: "$300",
        date: "Hier",
        statut: "en_cours",
    },
    {
        id: "3",
        numero: "CMD-0456",
        client: "Ruth M.",
        clientInitiales: "RM",
        clientAvatarColor: "bg-[#8c49b1]",
        prestatatoire: "Digital Boost",
        service: "Formation Leadership",
        montant: "$250",
        date: "12 Mars",
        statut: "litige",
    },
    {
        id: "4",
        numero: "CMD-0442",
        client: "Paul T.",
        clientInitiales: "PT",
        clientAvatarColor: "bg-[#25a04f]",
        prestatatoire: "Finance Pro",
        service: "Audit Financier",
        montant: "$450",
        date: "10 Mars",
        statut: "livre",
    },
];

interface Filters {
    statut: string;
}

const defaultFilters: Filters = { statut: "tous" };

const TableCommandes = () => {
    const { openDrawer } = useDrawer();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filtered = mockCommandes.filter((c) => {
        const matchSearch =
            !searchQuery ||
            c.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.prestatatoire.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.service.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatut =
            filters.statut === "tous" || c.statut === filters.statut;
        return matchSearch && matchStatut;
    });

    const totalCommandes = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCommandes / 10));

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => setFilters(defaultFilters);
    const applyFilters = () => setIsFilterOpen(false);

    const handleDetail = (commande: Commande) => {
        void commande;
        openDrawer("ShowCommande");
    };

    const handleTraiter = (commande: Commande) => {
        void commande;
        // Ouvrir modal / flow de traitement litige
    };

    const getRowClassName = () =>
        "border-b border-colorBorder last:border-b-0 transition-colors duration-200 hover:bg-bgGray/30";

    const getRowTextClass = () => "text-colorTitle";

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between md:gap-4 gap-3 px-5 md:px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">
                        Commandes
                    </h3>
                    <span className="text-[14px] text-colorMuted">
                        ({totalCommandes})
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
                                                <SelectValue placeholder="Tous statuts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">
                                                    Tous statuts
                                                </SelectItem>
                                                <SelectItem value="en_cours">
                                                    En cours
                                                </SelectItem>
                                                <SelectItem value="valide">
                                                    Validé
                                                </SelectItem>
                                                <SelectItem value="livre">
                                                    Livré
                                                </SelectItem>
                                                <SelectItem value="litige">
                                                    Litige
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
                                Nº Commande
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Client
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Prestataire
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Service
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Montant
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Date
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
                        {filtered.map((commande) => (
                            <tr
                                key={commande.id}
                                className={getRowClassName()}
                            >
                                <td
                                    className={`px-6 py-4 text-[14px] font-medium ${getRowTextClass()}`}
                                >
                                    {commande.numero}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0 ${commande.clientAvatarColor}`}
                                        >
                                            {commande.clientInitiales}
                                        </div>
                                        <span
                                            className={`text-[14px] font-medium ${getRowTextClass()}`}
                                        >
                                            {commande.client}
                                        </span>
                                    </div>
                                </td>
                                <td
                                    className={`px-4 py-4 text-center text-[14px] ${getRowTextClass()}`}
                                >
                                    {commande.prestatatoire}
                                </td>
                                <td
                                    className={`px-4 py-4 text-center text-[14px] ${getRowTextClass()}`}
                                >
                                    {commande.service}
                                </td>
                                <td
                                    className={`px-4 py-4 text-center text-[14px] font-semibold ${getRowTextClass()}`}
                                >
                                    {commande.montant}
                                </td>
                                <td
                                    className={`px-4 py-4 text-center text-[14px] ${getRowTextClass()}`}
                                >
                                    {commande.date}
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex justify-center">
                                        <StatutCommandeBadge
                                            statut={commande.statut}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <ActionCell
                                        statut={commande.statut}
                                        onDetail={() =>
                                            handleDetail(commande)
                                        }
                                        onTraiter={() =>
                                            handleTraiter(commande)
                                        }
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
                    Affichage 1-{totalCommandes} sur {totalCommandes} commandes
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

export default TableCommandes;
