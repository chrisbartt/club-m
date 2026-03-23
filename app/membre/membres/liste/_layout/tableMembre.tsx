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
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Crown, Download, Eye, Filter, Gem, Heart, Mail, Search, Sprout, X } from "lucide-react";
import { useState } from "react";
import { useDialog } from '@/context/dialog-context';
import Link from "next/link";

// Types
type StatutType = "business" | "premium" | "free";
type SupportType = "blue" | "red" | "yellow" | "none";

interface ModulesStatus {
    BA: boolean;
    BP: boolean;
    EI: boolean;
    FE: boolean;
    MK: boolean;
}

interface Membre {
    id: string;
    nom: string;
    email: string;
    initiales: string;
    statut: StatutType;
    modules: ModulesStatus;
    engagement: number;
    activite: string;
    activiteColor: "green" | "orange" | "blue";
    support: SupportType;
}

// Statut Badge Component
const StatutBadge = ({ statut }: { statut: StatutType }) => {
    const config = {
        business: {
            label: "Business",
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
            icon: <Crown size={12} />,
        },
        premium: {
            label: "Premium",
            className: "bg-[#8c49b1]/10 text-[#8c49b1]",
            icon: <Gem size={12} />,
        },
        free: {
            label: "Free",
            className: "bg-[#25a04f]/10 text-[#25a04f]",
            icon: <Sprout size={12} />,
        },
    };

    const { label, className, icon } = config[statut];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium ${className}`}>
            {icon}
            {label}
        </span>
    );
};

// Modules Badges Component
const ModulesBadges = ({ modules }: { modules: ModulesStatus }) => {
    const moduleKeys: (keyof ModulesStatus)[] = ["BA", "BP", "EI", "FE", "MK"];

    return (
        <div className="flex items-center gap-1">
            {moduleKeys.map((key) => (
                <span
                    key={key}
                    className={`w-[28px] h-[22px] flex items-center justify-center rounded text-[10px] font-semibold ${modules[key]
                        ? "bg-bgSidebar dark:bg-bgGray text-white"
                        : "bg-bgGray text-colorMuted"
                        }`}
                >
                    {key}
                </span>
            ))}
        </div>
    );
};

// Engagement Bar Component
const EngagementBar = ({ value }: { value: number }) => {
    const getBarColor = () => {
        if (value >= 70) return "bg-[#25a04f]";
        if (value >= 50) return "bg-[#e68b3c]";
        return "bg-[#dc2626]";
    };

    return (
        <div className="flex items-center gap-3">
            <div className="w-[80px] h-[6px] bg-bgGray rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${getBarColor()}`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className="text-[13px] font-medium text-colorTitle">{value}%</span>
        </div>
    );
};

// Activite Badge Component
const ActiviteBadge = ({ label, color }: { label: string; color: "green" | "orange" | "blue" }) => {
    const colors = {
        green: "bg-[#25a04f]/10 text-[#25a04f]",
        orange: "bg-[#e68b3c]/10 text-[#e68b3c]",
        blue: "bg-[#3b82f6]/10 text-[#3b82f6]",
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${colors[color]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${color === "green" ? "bg-emerald-500" : color === "orange" ? "bg-orange-500" : "bg-blue-500"}`} />
            {label}
        </span>
    );
};

// Support Icon Component
const SupportIcon = ({ type }: { type: SupportType }) => {
    if (type === "none") return <span className="text-colorMuted">-</span>;

    const colors = {
        blue: "text-[#3b82f6] fill-[#3b82f6]",
        red: "text-red-500 fill-red-500",
        yellow: "text-[#e17100] fill-[#e17100]",
    };

    return <Heart size={18} className={colors[type]} />;
};

// Mock Data
const mockMembres: Membre[] = [
    {
        id: "1",
        nom: "Marie Kabila",
        email: "marie.kabila@email.com",
        initiales: "MK",
        statut: "business",
        modules: { BA: true, BP: true, EI: true, FE: true, MK: false },
        engagement: 92,
        activite: "Aujourd'hui",
        activiteColor: "green",
        support: "blue",
    },
    {
        id: "2",
        nom: "Grace Mbeki",
        email: "grace.mbeki@email.com",
        initiales: "GM",
        statut: "premium",
        modules: { BA: true, BP: true, EI: false, FE: false, MK: false },
        engagement: 25,
        activite: "21 jours",
        activiteColor: "orange",
        support: "red",
    },
    {
        id: "3",
        nom: "Esther Nkumu",
        email: "esther.n@email.com",
        initiales: "EN",
        statut: "free",
        modules: { BA: true, BP: false, EI: false, FE: false, MK: false },
        engagement: 58,
        activite: "5 jours",
        activiteColor: "blue",
        support: "yellow",
    },
    {
        id: "4",
        nom: "Carine Bomba",
        email: "carine.b@email.com",
        initiales: "CB",
        statut: "free",
        modules: { BA: true, BP: true, EI: false, FE: true, MK: false },
        engagement: 78,
        activite: "Hier",
        activiteColor: "green",
        support: "none",
    },
    {
        id: "5",
        nom: "Jeanne Mutombo",
        email: "jeanne.m@email.com",
        initiales: "JM",
        statut: "business",
        modules: { BA: true, BP: true, EI: true, FE: true, MK: true },
        engagement: 85,
        activite: "2 jours",
        activiteColor: "blue",
        support: "none",
    },
    {
        id: "6",
        nom: "Florence Lukusa",
        email: "florence.l@email.com",
        initiales: "FL",
        statut: "free",
        modules: { BA: true, BP: false, EI: false, FE: false, MK: false },
        engagement: 18,
        activite: "45 jours",
        activiteColor: "orange",
        support: "yellow",
    },
    {
        id: "7",
        nom: "Angèle Ngoy",
        email: "angele.ngoy@email.com",
        initiales: "AN",
        statut: "premium",
        modules: { BA: true, BP: true, EI: true, FE: true, MK: false },
        engagement: 88,
        activite: "Aujourd'hui",
        activiteColor: "green",
        support: "none",
    },
];

// Avatar color based on status
const getAvatarColor = (statut: StatutType) => {
    const colors = {
        business: "bg-amber-600",
        premium: "bg-purple-600",
        free: "bg-emerald-600",
    };
    return colors[statut];
};

// Format number with spaces (consistent SSR/client)
const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// Filter types
interface Filters {
    statut: string;
    engagement: string;
    activite: string;
    inscription: string;
    businessPlan: string;
    epargne: string;
    marketplace: string;
    recherche: string;
}

const defaultFilters: Filters = {
    statut: "tous",
    engagement: "tous",
    activite: "toutes",
    inscription: "toutes",
    businessPlan: "tous",
    epargne: "tous",
    marketplace: "tous",
    recherche: "",
};

const TableMembre = () => {
    const { openDialog } = useDialog();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const totalMembers = 1284;
    const totalPages = 184;

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
                <div className="col-span-12 lg:col-span-6 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Membres</h3>
                    <span className="text-[14px] text-colorMuted">({formatNumber(totalMembers)} résultats)</span>
                </div>
                <div className="col-span-12 lg:col-span-6 flex items-center justify-end gap-3">
                    <div className="relative w-full max-w-[300px]">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <Input
                            type="text"
                            placeholder="Rechercher un membre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10  border-colorBorder bg-bgCard dark:bg-transparent text-[13px] placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-10 px-4 border-colorBorder dark:border-colorBorder dark:bg-transparent cursor-pointer text-colorTitle hover:bg-bgGray gap-2 shadow-none"
                            >
                                <Filter size={16} />
                                <span className="hidden sm:inline">Filtrer</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[700px] p-5" align="end">
                            {/* FILTRES GÉNÉRAUX */}
                            <div className="mb-5">
                                <h4 className="text-[12px] font-semibold text-bgSidebar uppercase tracking-wide mb-3">
                                    Filtres généraux
                                </h4>
                                <div className="grid grid-cols-5 gap-3">
                                    {/* Statut */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Statut</label>
                                        <Select value={filters.statut} onValueChange={(v) => handleFilterChange("statut", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="business">Business</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                                <SelectItem value="free">Free</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Engagement */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Engagement</label>
                                        <Select value={filters.engagement} onValueChange={(v) => handleFilterChange("engagement", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="haut">Haut (&gt;70%)</SelectItem>
                                                <SelectItem value="moyen">Moyen (50-70%)</SelectItem>
                                                <SelectItem value="bas">Bas (&lt;50%)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Activité */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Activité</label>
                                        <Select value={filters.activite} onValueChange={(v) => handleFilterChange("activite", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Toutes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="toutes">Toutes</SelectItem>
                                                <SelectItem value="aujourdhui">Aujourd&apos;hui</SelectItem>
                                                <SelectItem value="7jours">7 derniers jours</SelectItem>
                                                <SelectItem value="30jours">30 derniers jours</SelectItem>
                                                <SelectItem value="inactif">Inactif (+30 jours)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Inscription */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Inscription</label>
                                        <Select value={filters.inscription} onValueChange={(v) => handleFilterChange("inscription", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Toutes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="toutes">Toutes</SelectItem>
                                                <SelectItem value="7jours">7 derniers jours</SelectItem>
                                                <SelectItem value="30jours">30 derniers jours</SelectItem>
                                                <SelectItem value="3mois">3 derniers mois</SelectItem>
                                                <SelectItem value="ancien">Plus ancien</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Recherche */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted invisible">Rechercher</label>
                                        <div className="relative">
                                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-colorMuted" />
                                            <Input
                                                type="text"
                                                placeholder="Rechercher..."
                                                value={filters.recherche}
                                                onChange={(e) => handleFilterChange("recherche", e.target.value)}
                                                className="h-9 pl-8 text-[13px] border-colorBorder shadow-none focus-visible:ring-0"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FILTRES PAR MODULE */}
                            <div className="mb-5">
                                <h4 className="text-[12px] font-semibold text-bgSidebar uppercase tracking-wide mb-3">
                                    Filtres par module
                                </h4>
                                <div className="grid grid-cols-5 gap-3">
                                    {/* Business Plan */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Business Plan</label>
                                        <Select value={filters.businessPlan} onValueChange={(v) => handleFilterChange("businessPlan", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="actif">Actif</SelectItem>
                                                <SelectItem value="termine">Terminé</SelectItem>
                                                <SelectItem value="non_commence">Non commencé</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Épargne */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Épargne</label>
                                        <Select value={filters.epargne} onValueChange={(v) => handleFilterChange("epargne", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="actif">Actif</SelectItem>
                                                <SelectItem value="inactif">Inactif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Marketplace */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-medium text-colorMuted">Marketplace</label>
                                        <Select value={filters.marketplace} onValueChange={(v) => handleFilterChange("marketplace", v)}>
                                            <SelectTrigger className="h-9 text-[13px] border-colorBorder shadow-none focus:ring-0">
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="tous">Tous</SelectItem>
                                                <SelectItem value="vendeur">Vendeur</SelectItem>
                                                <SelectItem value="non_vendeur">Non vendeur</SelectItem>
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
                    <Button
                        className="h-10 px-4 bg-bgSidebar dark:bg-bgGray text-white hover:bg-bgSidebar/90 gap-2 shadow-none"
                    >
                        <Download size={16} />
                        <span className="hidden sm:inline">Exporter</span>
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                    <thead>
                        <tr className="border-y border-colorBorder bg-bgGray/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-colorTitle">
                                    Membre <ChevronsUpDown size={14} />
                                </div>
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-colorTitle">
                                    Statut <ChevronsUpDown size={14} />
                                </div>
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Modules
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-colorTitle">
                                    Engagement <ChevronDown size={14} />
                                </div>
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                <div className="flex items-center gap-1 cursor-pointer hover:text-colorTitle">
                                    Activité <ChevronsUpDown size={14} />
                                </div>
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Support
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
                                            className={`w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold ${getAvatarColor(membre.statut)}`}
                                        >
                                            {membre.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-medium text-colorTitle">
                                                {membre.nom}
                                            </p>
                                            <p className="text-[12px] text-colorMuted">
                                                {membre.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Statut */}
                                <td className="px-4 py-4">
                                    <StatutBadge statut={membre.statut} />
                                </td>

                                {/* Modules */}
                                <td className="px-4 py-4">
                                    <ModulesBadges modules={membre.modules} />
                                </td>

                                {/* Engagement */}
                                <td className="px-4 py-4">
                                    <EngagementBar value={membre.engagement} />
                                </td>

                                {/* Activité */}
                                <td className="px-4 py-4">
                                    <ActiviteBadge label={membre.activite} color={membre.activiteColor} />
                                </td>

                                {/* Support */}
                                <td className="px-4 py-4 text-center">
                                    <div className="flex items-center justify-center">
                                        <SupportIcon type={membre.support} />
                                    </div>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <Link href={`/membres/liste/${membre.id}`} className="w-[34px] h-[34px] flex items-center justify-center border border-colorBorder rounded-lg text-colorMuted hover:bg-bgGray hover:text-colorTitle transition-all duration-200">
                                            <Eye size={16} />
                                        </Link>
                                        <button className="w-[34px] h-[34px] flex items-center justify-center border border-colorBorder rounded-lg text-colorMuted hover:bg-bgGray hover:text-colorTitle transition-all duration-200" onClick={() => openDialog("messageDialog")}>
                                            <Mail size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    1 à 7 sur {formatNumber(totalMembers)} membres
                </p>

                <div className="flex items-center gap-1">
                    <button
                        className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-colorBorder text-colorMuted hover:bg-bgGray disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {[1, 2, 3].map((page) => (
                        <button
                            key={page}
                            className={`w-[32px] h-[32px] flex items-center justify-center rounded-lg text-[13px] font-medium ${currentPage === page
                                ? "bg-bgSidebar text-white"
                                : "border border-colorBorder text-colorTitle hover:bg-bgGray"
                                }`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <span className="px-2 text-colorMuted">...</span>

                    <button
                        className="w-[40px] h-[32px] flex items-center justify-center rounded-lg border border-colorBorder text-[13px] font-medium text-colorTitle hover:bg-bgGray"
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        {totalPages}
                    </button>

                    <button
                        className="w-[32px] h-[32px] flex items-center justify-center rounded-lg border border-colorBorder text-colorMuted hover:bg-bgGray disabled:opacity-50"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableMembre;
