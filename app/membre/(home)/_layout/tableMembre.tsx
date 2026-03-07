"use client";

import { Crown, Eye, Gem, Sprout } from "lucide-react";
import Link from "next/link";

// Types
type StatutType = "business" | "premium" | "free";
type BusinessPlanStatus = "a_jour" | "en_retard" | "en_cours" | "finalise" | "non_commence";
type TontineStatus = "active" | "retard" | "aucune";

interface Membre {
    id: string;
    nom: string;
    secteur: string;
    initiales: string;
    avatarColor: string;
    statut: StatutType;
    businessPlan: BusinessPlanStatus;
    tontine: TontineStatus;
    ateliersSuivis: number;
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

// Business Plan Status Component
const BusinessPlanBadge = ({ status }: { status: BusinessPlanStatus }) => {
    const config = {
        a_jour: { label: "À jour", dotColor: "bg-[#25a04f]", textColor: "text-[#25a04f]" },
        en_retard: { label: "En retard", dotColor: "bg-red-500", textColor: "text-red-600" },
        en_cours: { label: "En cours", dotColor: "bg-[#3b82f6]", textColor: "text-[#3b82f6]" },
        finalise: { label: "Finalisé", dotColor: "bg-[#25a04f]", textColor: "text-[#25a04f]" },
        non_commence: { label: "Non commencé", dotColor: "bg-gray-400", textColor: "text-colorMuted" },
    };

    const { label, dotColor, textColor } = config[status];

    return (
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            <span className={`text-[13px] ${textColor}`}>{label}</span>
        </div>
    );
};

// Tontine Status Component
const TontineBadge = ({ status }: { status: TontineStatus }) => {
    const config = {
        active: { label: "Active", dotColor: "bg-[#25a04f]", textColor: "text-[#25a04f]" },
        retard: { label: "Retard", dotColor: "bg-red-500", textColor: "text-red-600" },
        aucune: { label: "Aucune", dotColor: "bg-gray-400", textColor: "text-colorMuted" },
    };

    const { label, dotColor, textColor } = config[status];

    return (
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            <span className={`text-[13px] ${textColor}`}>{label}</span>
        </div>
    );
};

// Ateliers Badge Component
const AteliersBadge = ({ count }: { count: number }) => {
    const dotColor = count > 0 ? "bg-[#25a04f]" : "bg-red-500";
    const textColor = count > 0 ? "text-[#25a04f]" : "text-red-600";
    const label = count > 1 ? `${count} suivis` : `${count} suivi`;

    return (
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            <span className={`text-[13px] ${textColor}`}>{label}</span>
        </div>
    );
};

// Mock Data
const mockMembres: Membre[] = [
    {
        id: "1",
        nom: "Marie Kabila",
        secteur: "Agroalimentaire",
        initiales: "MK",
        avatarColor: "bg-bgSidebar",
        statut: "business",
        businessPlan: "a_jour",
        tontine: "active",
        ateliersSuivis: 8,
    },
    {
        id: "2",
        nom: "Grace Mbeki",
        secteur: "Cosmétiques",
        initiales: "GM",
        avatarColor: "bg-cyan-600",
        statut: "premium",
        businessPlan: "en_retard",
        tontine: "retard",
        ateliersSuivis: 5,
    },
    {
        id: "3",
        nom: "Esther Nkumu",
        secteur: "Mode & Accessoires",
        initiales: "EN",
        avatarColor: "bg-emerald-600",
        statut: "free",
        businessPlan: "en_cours",
        tontine: "aucune",
        ateliersSuivis: 2,
    },
    {
        id: "4",
        nom: "Jeanne Mutombo",
        secteur: "Conseil & Formation",
        initiales: "JM",
        avatarColor: "bg-amber-500",
        statut: "business",
        businessPlan: "finalise",
        tontine: "active",
        ateliersSuivis: 12,
    },
    {
        id: "5",
        nom: "Florence Lukusa",
        secteur: "Services digitaux",
        initiales: "FL",
        avatarColor: "bg-purple-500",
        statut: "free",
        businessPlan: "non_commence",
        tontine: "aucune",
        ateliersSuivis: 0,
    },
];

const TableMembre = () => {
    return (
        <div className="card cardTable cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 lg:px-6 lg:py-5 border-b border-colorBorder">
                {/* Title */}
                <div className="flex items-center gap-3">
                    <div>
                        <h3 className="text-[16px] font-semibold text-colorTitle">
                            Membres et suivi
                        </h3>
                        <p className="text-[13px] text-colorMuted">
                            Accès rapide aux membres clés
                        </p>
                    </div>
                </div>

                {/* View All Button */}
                <Link
                    href="/membres"
                    className="flex items-center gap-2 px-4 py-2 bg-bgSidebar dark:bg-bgGray rounded-lg text-[13px] font-medium text-white hover:opacity-90 transition-all duration-200"
                >
                    <Eye size={16} />
                    <span>Voir tous</span>
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-colorBorder">
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-6 py-3">
                                Membre
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Statut
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Business Plan
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Tontine
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Ateliers
                            </th>
                            <th className="text-left text-[11px] font-semibold text-colorMuted uppercase tracking-wider px-4 py-3">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockMembres.map((membre) => (
                            <tr
                                key={membre.id}
                                className="border-b border-colorBorder last:border-b-0 hover:bg-bgGray/50 transition-colors duration-200"
                            >
                                {/* Membre */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-white text-[12px] font-semibold ${membre.avatarColor}`}
                                        >
                                            {membre.initiales}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-medium text-colorTitle">
                                                {membre.nom}
                                            </p>
                                            <p className="text-[12px] text-colorMuted">
                                                {membre.secteur}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Statut */}
                                <td className="px-4 py-4">
                                    <StatutBadge statut={membre.statut} />
                                </td>

                                {/* Business Plan */}
                                <td className="px-4 py-4">
                                    <BusinessPlanBadge status={membre.businessPlan} />
                                </td>

                                {/* Tontine */}
                                <td className="px-4 py-4">
                                    <TontineBadge status={membre.tontine} />
                                </td>

                                {/* Ateliers */}
                                <td className="px-4 py-4">
                                    <AteliersBadge count={membre.ateliersSuivis} />
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-4">
                                    <button className="px-3 py-1.5 border border-colorBorder rounded-lg text-[12px] font-medium text-colorTitle hover:bg-bgGray transition-all duration-200">
                                        Ouvrir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableMembre;
