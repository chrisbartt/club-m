"use client";

import { Eye } from "lucide-react";
import Link from "next/link";

// Types
type StatutCommande = "en_cours" | "livre" | "litige";

interface Commande {
    id: string;
    ref: string;
    client: string;
    prestataire: string;
    montant: string;
    statut: StatutCommande;
}

// Badge statut commande : point + libellé, couleurs projet
const StatutCommandeBadge = ({ statut }: { statut: StatutCommande }) => {
    const config = {
        en_cours: {
            label: "En cours",
            dotColor: "bg-[#3a86ff]",
            badgeClass: "bg-[#3a86ff]/10 text-[#3a86ff]",
        },
        livre: {
            label: "Livré",
            dotColor: "bg-[#8c49b1]",
            badgeClass: "bg-[#8c49b1]/10 text-[#8c49b1]",
        },
        litige: {
            label: "Litige",
            dotColor: "bg-[#dd3d3d]",
            badgeClass: "bg-[#dd3d3d]/10 text-[#dd3d3d]",
        },
    };

    const { label, dotColor, badgeClass } = config[statut];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium ${badgeClass}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
            {label}
        </span>
    );
};

// Données : 3 commandes récentes
const mockCommandes: Commande[] = [
    {
        id: "1",
        ref: "CMD-0467",
        client: "Grace K.",
        prestataire: "Keza Consulting",
        montant: "$150",
        statut: "en_cours",
    },
    {
        id: "2",
        ref: "CMD-0466",
        client: "Ruth L.",
        prestataire: "Digital Boost",
        montant: "$300",
        statut: "livre",
    },
    {
        id: "3",
        ref: "CMD-0456",
        client: "Sophie M.",
        prestataire: "Keza Consulting",
        montant: "$200",
        statut: "litige",
    },
];

const TableCommande = () => {
    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between md:gap-4 gap-3 p-5 lg:px-6 lg:py-5 border-b border-colorBorder">
                <div className="flex items-center gap-3">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Commandes récentes</h3>
                </div>

                <div className="flex items-center gap-2">
                <Link
                    href="/admin/marketplace/commandes"
                    className="flex items-center gap-2 px-4 py-2 bg-bgSidebar dark:bg-bgGray rounded-lg text-[13px] font-medium text-white hover:opacity-90 transition-all duration-200"
                >
                    <Eye size={16} />
                    <span>Voir tout</span>
                </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b border-colorBorder bg-bgGray/50">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Commande
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Client → Prestataire
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Montant
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Statut
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockCommandes.map((cmd) => (
                            <tr
                                key={cmd.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/50 transition-colors duration-200"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-[14px] font-medium text-colorTitle">{cmd.ref}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[14px] text-colorTitle">
                                        {cmd.client} → {cmd.prestataire}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-[14px] font-bold text-colorTitle">{cmd.montant}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <StatutCommandeBadge statut={cmd.statut} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableCommande;
