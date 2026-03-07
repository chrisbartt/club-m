"use client";

import { ArrowRight, Check, Clock, Eye, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Types
type DemandeStatus = "en_attente" | "a_verifier" | "acceptee" | "refusee";

interface Demande {
    id: string;
    membre: {
        nom: string;
        email: string;
        initiales: string;
        avatarColor: string;
    };
    date: string;
    besoinPrincipal: string;
    statut: DemandeStatus;
}

// Status Badge Component
const StatusBadge = ({ status }: { status: DemandeStatus }) => {
    const config = {
        en_attente: {
            label: "En attente",
            icon: <Clock size={12} />,
            className: "bg-[#e68b3c]/10 text-[#e68b3c]",
        },
        a_verifier: {
            label: "À vérifier",
            icon: <Eye size={12} />,
            className: "bg-[#3b82f6]/10 text-[#3b82f6]",
        },
        acceptee: {
            label: "Acceptée",
            icon: <Check size={12} />,
            className: "bg-[#25a04f]/10 text-[#25a04f]",
        },
        refusee: {
            label: "Refusée",
            icon: null,
            className: "bg-red-100 text-red-600",
        },
    };

    const { label, icon, className } = config[status];

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${className}`}>
            {icon}
            {label}
        </span>
    );
};

// Mock Data
const mockDemandes: Demande[] = [
    {
        id: "1",
        membre: {
            nom: "Sophie Mwamba",
            email: "sophie.m@email.com",
            initiales: "SM",
            avatarColor: "bg-bgSidebar dark:bg-[#222529]",
        },
        date: "29 Jan 2026",
        besoinPrincipal: "Clarifier mon idée & structurer mon projet",
        statut: "en_attente",
    },
    {
        id: "2",
        membre: {
            nom: "Clarisse Ndaya",
            email: "clarisse.n@email.com",
            initiales: "CN",
            avatarColor: "bg-cyan-600",
        },
        date: "28 Jan 2026",
        besoinPrincipal: "Développer mon réseau & trouver des clientes",
        statut: "a_verifier",
    },
    {
        id: "3",
        membre: {
            nom: "Linda Kasongo",
            email: "linda.k@email.com",
            initiales: "LK",
            avatarColor: "bg-emerald-600",
        },
        date: "27 Jan 2026",
        besoinPrincipal: "Structurer mes finances & épargner",
        statut: "en_attente",
    },
    {
        id: "4",
        membre: {
            nom: "Alice Bongolo",
            email: "alice.b@email.com",
            initiales: "AB",
            avatarColor: "bg-amber-500",
        },
        date: "26 Jan 2026",
        besoinPrincipal: "Lancer mon e-commerce de cosmétiques",
        statut: "acceptee",
    },
];

const TableNewDamande = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const totalDemandes = 18;

    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 lg:px-6 lg:py-5 border-b border-colorBorder">
                {/* Title */}
                <div className="flex items-center gap-3">

                    <div>
                        <h3 className="text-[16px] font-semibold text-colorTitle">
                            Nouvelles demandes d&apos;adhésion
                        </h3>
                        <p className="text-[13px] text-colorMuted">
                            12 demandes en attente de validation
                        </p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-colorMuted" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[180px] lg:w-[200px] pl-9 pr-3 py-2 text-[13px] border border-colorBorder rounded-lg bg-bgCard text-colorTitle placeholder:text-colorMuted focus:outline-none focus:border-bgSidebar transition-all duration-200"
                        />
                    </div>

                    {/* Filter Button */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-colorBorder rounded-lg text-[13px] font-medium text-colorTitle hover:bg-bgGray transition-all duration-200">
                        <SlidersHorizontal size={16} />
                        <span>Filtres</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead>
                        <tr className="border-b border-colorBorder">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Membre
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Date
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Besoin principal
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Statut
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockDemandes.map((demande) => (
                            <tr
                                key={demande.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/50 transition-colors duration-200"
                            >
                                {/* Membre */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold ${demande.membre.avatarColor}`}
                                        >
                                            {demande.membre.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-medium text-colorTitle">
                                                {demande.membre.nom}
                                            </p>
                                            <p className="text-[12px] text-colorMuted">
                                                {demande.membre.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Date */}
                                <td className="px-4 py-4">
                                    <span className="text-[13px] text-colorTitle">{demande.date}</span>
                                </td>

                                {/* Besoin principal */}
                                <td className="px-4 py-4">
                                    <span className="text-[13px] text-colorTitle">{demande.besoinPrincipal}</span>
                                </td>

                                {/* Statut */}
                                <td className="px-4 py-4">
                                    <StatusBadge status={demande.statut} />
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4">
                                    <Link href="/admin/membres/liste/1" className="px-3 py-1.5 border border-colorBorder rounded-lg text-[12px] font-medium text-colorTitle hover:bg-bgGray transition-all duration-200">
                                        Voir la fiche
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex justify-end px-6 py-4">
                <Link
                    href="/admin/epargne-tontines/demandes"
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-colorTitle hover:underline transition-all duration-200"
                >
                    Voir toutes les demandes ({totalDemandes})
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default TableNewDamande;
