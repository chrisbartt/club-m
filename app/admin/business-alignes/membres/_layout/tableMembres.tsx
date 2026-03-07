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
import { AlertTriangle, ChevronLeft, ChevronRight, Download, Filter, Search, Star, XCircle, X as XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Types
type EngagementType = "tres_engagee" | "a_soutenir" | "decrochage";
type ActionType = "profil" | "relancer" | "urgent";

interface Membre {
    id: string;
    initiales: string;
    nom: string;
    email: string;
    avatarColor: string;
    businessPlan: string;
    avancement: number;
    engagement: EngagementType;
    derniereActivite: string;
    action: ActionType;
}

// Engagement Badge Component
const EngagementBadge = ({ engagement }: { engagement: EngagementType }) => {
    const config = {
        tres_engagee: {
            label: "Très engagée",
            className: "bg-[#25a04f]/10 text-[#25a04f]",
            icon: <Star size={12} className="fill-[#25a04f]" />,
        },
        a_soutenir: {
            label: "À soutenir",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
            icon: <AlertTriangle size={12} />,
        },
        decrochage: {
            label: "Décrochage",
            className: "bg-[#dd3d3d]/10 text-[#dd3d3d]",
            icon: <XCircle size={12} />,
        },
    };

    const { label, className, icon } = config[engagement];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${className}`}>
            {icon}
            {label}
        </span>
    );
};

// Action Button Component
const ActionButton = ({
    action,
    membreId,
    onShowDetail,
}: {
    action: ActionType;
    membreId: string;
    onShowDetail: () => void;
}) => {
    const config = {
        profil: {
            label: "Profil",
            className: "text-colorMuted hover:text-colorTitle",
        },
        relancer: {
            label: "Relancer",
            className: "bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90",
        },
        urgent: {
            label: "Urgent",
            className: "bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90",
        },
    };

    const { label, className } = config[action];

    if (action === "profil") {
        return (
            <Link
                href={`/admin/membres/liste/${membreId}`}
                className={`inline-flex px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${className}`}
            >
                {label}
            </Link>
        );
    }

    return (
        <button
            onClick={onShowDetail}
            className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${className}`}
        >
            {label}
        </button>
    );
};

// Mock Data
const mockMembres: Membre[] = [
    {
        id: "1",
        initiales: "MK",
        nom: "Marie Kabongo",
        email: "marie.k@email.com",
        avatarColor: "bg-[#25a04f]",
        businessPlan: "Salon Beauté Marie",
        avancement: 92,
        engagement: "tres_engagee",
        derniereActivite: "Aujourd'hui",
        action: "profil",
    },
    {
        id: "2",
        initiales: "EM",
        nom: "Esther Mutombo",
        email: "esther.m@email.com",
        avatarColor: "bg-[#e68b3c]",
        businessPlan: "Esther Couture",
        avancement: 88,
        engagement: "tres_engagee",
        derniereActivite: "Hier",
        action: "profil",
    },
    {
        id: "3",
        initiales: "AM",
        nom: "Aline Makoso",
        email: "aline.m@email.com",
        avatarColor: "bg-[#8c49b1]",
        businessPlan: "Boutique Aline Mode",
        avancement: 35,
        engagement: "a_soutenir",
        derniereActivite: "Il y a 8 jours",
        action: "relancer",
    },
    {
        id: "4",
        initiales: "FT",
        nom: "Flora Tshimanga",
        email: "flora.t@email.com",
        avatarColor: "bg-[#dd3d3d]",
        businessPlan: "Flora Boutique",
        avancement: 28,
        engagement: "decrochage",
        derniereActivite: "Il y a 12 jours",
        action: "urgent",
    },
];

// Filter types
interface Filters {
    engagement: string;
    avancement: string;
}

const defaultFilters: Filters = {
    engagement: "tous",
    avancement: "tous",
};

const TableMembres = () => {
    const { openDrawer } = useDrawer();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const totalMembres = 4;
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
            <div className="grid grid-cols-12 items-center justify-between md:gap-4 gap-3 md:px-6 px-5 py-4 ">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Membres</h3>
                    <span className="text-[14px] text-colorMuted">({totalMembres})</span>
                </div>
                <div className="col-span-12 lg:col-span-8 flex items-center justify-end md:gap-3 gap-2">
                    {/* Search */}
                    <div className="relative w-full max-w-[250px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher un membre..."
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
                                    {/* Engagement */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Engagement</label>
                                        <Select value={filters.engagement} onValueChange={(v) => handleFilterChange("engagement", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="tres_engagee">Très engagée</SelectItem>
                                                <SelectItem value="a_soutenir">À soutenir</SelectItem>
                                                <SelectItem value="decrochage">Décrochage</SelectItem>
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
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-y border-colorBorder bg-gray-50/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Membre
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Business Plan
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Avancement
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Engagement
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Dernière activité
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockMembres.map((membre) => (
                            <tr
                                key={membre.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/30 transition-colors duration-200"
                            >
                                {/* Membre */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-white text-[13px] font-semibold ${membre.avatarColor}`}
                                        >
                                            {membre.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-semibold text-colorTitle">{membre.nom}</p>
                                            <p className="text-[12px] text-colorMuted">{membre.email}</p>
                                        </div>
                                    </div>
                                </td>

                                {/* Business Plan */}
                                <td className="px-4 py-4">
                                    <Link
                                        href={`/business-plans/dossiers/${membre.id}`}
                                        className="text-[13px] text-colorTitle hover:text-bgSidebar transition-colors"
                                    >
                                        {membre.businessPlan}
                                    </Link>
                                </td>

                                {/* Avancement */}
                                <td className="px-4 py-4 text-center">
                                    <span className="text-[14px] font-medium text-colorTitle">{membre.avancement}%</span>
                                </td>

                                {/* Engagement */}
                                <td className="px-4 py-4 text-center">
                                    <EngagementBadge engagement={membre.engagement} />
                                </td>

                                {/* Dernière activité */}
                                <td className="px-4 py-4">
                                    <span className="text-[13px] text-colorMuted">{membre.derniereActivite}</span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4 text-center">
                                    <ActionButton action={membre.action} membreId={membre.id} onShowDetail={() => openDrawer("ShowDetail")} />
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

export default TableMembres;
