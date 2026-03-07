"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { useState } from "react";

// Types
interface PaiementRecent {
    id: string;
    commande: string;
    montant: string;
    prestatatoire: string;
    libereLe: string;
    commission: string; // ex: "$45 (10%)"
}

// Mock Data - Paiements récemment libérés (maquette)
const mockPaiementsRecent: PaiementRecent[] = [
    {
        id: "1",
        commande: "CMD-0460",
        montant: "$450",
        prestatatoire: "Finance Pro",
        libereLe: "Aujourd'hui, 10:30",
        commission: "$45 (10%)",
    },
    {
        id: "2",
        commande: "CMD-0458",
        montant: "$150",
        prestatatoire: "Keza Consulting",
        libereLe: "Hier, 16:45",
        commission: "$15 (10%)",
    },
    {
        id: "3",
        commande: "CMD-0455",
        montant: "$300",
        prestatatoire: "Digital Boost",
        libereLe: "11 Mars",
        commission: "$30 (10%)",
    },
];

const TablePayRecent = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = mockPaiementsRecent.filter(
        (p) =>
            !searchQuery ||
            p.commande.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.prestatatoire.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.montant.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPaiements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalPaiements / 10));

    const getRowClassName = () =>
        "border-b border-colorBorder last:border-b-0 transition-colors duration-200 hover:bg-bgGray/30";

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle flex items-center gap-2">
                        Paiements récemment libérés
                    </h3>
                    <span className="text-[14px] text-colorMuted">
                        ({totalPaiements})
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
                            placeholder="Rechercher une commande..."
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
                                Commande
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Montant
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Prestataire
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Libéré le
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Commission Club M
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
                                    {p.libereLe}
                                </td>
                                <td className="px-6 py-4 text-[14px] font-medium text-[#0d9488]">
                                    {p.commission}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalPaiements} sur {totalPaiements} paiements
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1.5 text-[13px] text-colorMuted hover:text-colorTitle disabled:opacity-50 transition-colors cursor-pointer"
                        disabled={currentPage === 1}
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
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
                            setCurrentPage((prev) =>
                                Math.min(totalPages, prev + 1)
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

export default TablePayRecent;
