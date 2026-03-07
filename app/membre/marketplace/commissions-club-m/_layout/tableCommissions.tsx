"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { useState } from "react";

// Types
interface CommissionDetail {
    id: string;
    commande: string;
    service: string;
    montantTransaction: string;
    commission: string;
    date: string;
}

// Mock Data - Détail des commissions (maquette)
const mockCommissions: CommissionDetail[] = [
    {
        id: "1",
        commande: "CMD-0460",
        service: "Audit Financier",
        montantTransaction: "$450",
        commission: "$45",
        date: "Aujourd'hui",
    },
    {
        id: "2",
        commande: "CMD-0458",
        service: "Accompagnement BP",
        montantTransaction: "$150",
        commission: "$15",
        date: "Hier",
    },
    {
        id: "3",
        commande: "CMD-0455",
        service: "Stratégie Marketing",
        montantTransaction: "$300",
        commission: "$30",
        date: "11 Mars",
    },
    {
        id: "4",
        commande: "CMD-0452",
        service: "Formation Leadership",
        montantTransaction: "$300",
        commission: "$30",
        date: "9 Mars",
    },
];

const TableCommissions = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = mockCommissions.filter(
        (c) =>
            !searchQuery ||
            c.commande.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.commission.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalCommissions = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCommissions / 10));

    const getRowClassName = () =>
        "border-b border-colorBorder last:border-b-0 transition-colors duration-200 hover:bg-bgGray/30";

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="grid grid-cols-12 items-center justify-between gap-4 px-6 py-4">
                <div className="col-span-12 lg:col-span-4 flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle flex items-center gap-2">
                        Détail des commissions
                    </h3>
                    <span className="text-[14px] text-colorMuted">
                        ({totalCommissions})
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
                                Service
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Montant transaction
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Commission (10%)
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c) => (
                            <tr key={c.id} className={getRowClassName()}>
                                <td className="px-6 py-4 text-[14px] font-semibold text-colorTitle">
                                    {c.commande}
                                </td>
                                <td className="px-4 py-4 text-[14px] text-colorTitle">
                                    {c.service}
                                </td>
                                <td className="px-4 py-4 text-[14px] text-colorTitle">
                                    {c.montantTransaction}
                                </td>
                                <td className="px-4 py-4 text-[14px] font-medium text-[#25a04f]">
                                    {c.commission}
                                </td>
                                <td className="px-6 py-4 text-[14px] text-colorTitle">
                                    {c.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-colorBorder">
                <p className="text-[13px] text-colorMuted">
                    Affichage 1-{totalCommissions} sur {totalCommissions} commissions
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

export default TableCommissions;
