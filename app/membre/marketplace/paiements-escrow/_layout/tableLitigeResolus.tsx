"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDrawer } from "@/context/drawer-context";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Search,
} from "lucide-react";
import { useState } from "react";

// Types
type ResolutionLitige = "remboursement_partiel" | "livraison_validee";

interface LitigeResolu {
    id: string;
    numeroLitige: string;
    client: string;
    clientInitiales: string;
    clientAvatarColor: string;
    prestatatoire: string;
    resolution: ResolutionLitige;
    date: string;
}

// Badge résolution (fond vert clair, texte vert)
const ResolutionBadge = ({ resolution }: { resolution: ResolutionLitige }) => {
    const config: Record<ResolutionLitige, { label: string }> = {
        remboursement_partiel: { label: "Remboursement partiel" },
        livraison_validee: { label: "Livraison validée" },
    };
    const { label } = config[resolution];
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
            {label}
        </span>
    );
};

// Mock Data - Litiges résolus récemment (maquette)
const mockLitigesResolus: LitigeResolu[] = [
    {
        id: "1",
        numeroLitige: "LIT-0086",
        client: "Esther M.",
        clientInitiales: "EM",
        clientAvatarColor: "bg-[#25a04f]",
        prestatatoire: "Finance Pro",
        resolution: "remboursement_partiel",
        date: "5 Mars",
    },
    {
        id: "2",
        numeroLitige: "LIT-0085",
        client: "Flora T.",
        clientInitiales: "FT",
        clientAvatarColor: "bg-[#8c49b1]",
        prestatatoire: "Keza Consulting",
        resolution: "livraison_validee",
        date: "3 Mars",
    },
];

const TableLitigeResolus = () => {
    const { openDrawer } = useDrawer();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = mockLitigesResolus.filter(
        (l) =>
            !searchQuery ||
            l.numeroLitige.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.prestatatoire.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalLitiges = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalLitiges / 10));

    const openShowLitige = (litige: LitigeResolu) => {
        openDrawer("ShowLitige", litige);
    };

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle flex items-center gap-2">
                        Litiges résolus récemment
                    </h3>
                    <span className="text-[14px] text-colorMuted">
                        ({totalLitiges})
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
                            placeholder="Rechercher un litige..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 bg-white border-colorBorder text-[13px] placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
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
                                N° Litige
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Parties
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Résolution
                            </th>
                            <th className="text-center text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Date
                            </th>
                            <th className="text-right text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Décision
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((litige) => (
                            <tr
                                key={litige.id}
                                className="border-b border-colorBorder last:border-b-0 transition-colors duration-200 hover:bg-bgGray/30"
                            >
                                <td className="px-6 py-4 text-[14px] font-medium text-colorTitle">
                                    {litige.numeroLitige}
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
                                        <ResolutionBadge
                                            resolution={litige.resolution}
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-center text-[14px] text-colorTitle">
                                    {litige.date}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openShowLitige(litige)}
                                            className="h-9 px-4 rounded-md shadow-none bg-white border border-colorBorder text-colorTitle hover:bg-bgGray cursor-pointer text-[13px]"
                                        >
                                            Voir
                                        </Button>
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

export default TableLitigeResolus;
