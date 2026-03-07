"use client";

import { DollarSign, Package, ShoppingCart, TrendingUp, Wallet, RefreshCw } from "lucide-react";
import React from "react";

interface StatCardProps {
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
    subtitle: string;
    badge?: {
        value: string;
        type: "up" | "stable" | "down";
    };
}

const Badge = ({ value, type }: { value: string; type: "up" | "stable" | "down" }) => {
    const bgColor =
        type === "up"
            ? "bg-[#25a04f]/10 text-[#25a04f]"
            : type === "down"
                ? "bg-red-100 text-red-600"
                : "bg-bgGray text-colorMuted";

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${bgColor}`}>
            {type === "up" && <TrendingUp size={12} />}
            {value}
        </span>
    );
};

const StatCard = ({ icon, iconBgColor, value, label, subtitle, badge }: StatCardProps) => {
    return (
        <div className="bg-bgCard rounded-xl p-4 lg:p-5 flex flex-col gap-3 cardShadow h-full">
            <div className="flex items-start justify-between">
                <div className={`md:w-[48px] w-[40px] md:h-[48px] h-[40px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                    {icon}
                </div>
                {badge && <Badge value={badge.value} type={badge.type} />}
            </div>
            <div>
                <p className="text-[28px] lg:text-[32px] font-bold text-colorTitle leading-none mb-2">{value}</p>
                <p className="text-[14px] font-medium text-colorTitle">{label}</p>
                <p className="text-[12px] text-colorMuted">{subtitle}</p>
            </div>
        </div>
    );
};

const FinanceCard = ({ icon, iconBgColor, value, label, subtitle, badge }: StatCardProps) => {
    return (
        <div className="bg-primaryColor rounded-xl p-4 lg:p-5 flex flex-col gap-3 cardShadow h-full relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`md:w-[48px] w-[40px] md:h-[48px] h-[40px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                        {icon}
                    </div>
                    {badge && <Badge value={badge.value} type={badge.type} />}
                </div>
                <div>
                    <p className="text-[28px] lg:text-[32px] font-bold text-white leading-none mb-2">{value}</p>
                    <p className="text-[14px] font-medium text-white">{label}</p>
                    <p className="text-[12px] text-white/80">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};

const MemberCardsWidgets = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <FinanceCard
                icon={<DollarSign size={24} className="text-primaryColor" />}
                iconBgColor="bg-bgCard"
                value="$2,450"
                label="Revenus totaux"
                subtitle="Ce mois-ci"
                badge={{ value: "+15%", type: "up" }}
            />
            <StatCard
                icon={<Package size={24} className="text-white" />}
                iconBgColor="bg-[#3b82f6]"
                value="3"
                label="Offres actives"
                subtitle="Produits en vente"
            />
            <StatCard
                icon={<ShoppingCart size={24} className="text-white" />}
                iconBgColor="bg-[#25a04f]"
                value="12"
                label="Commandes"
                subtitle="Ce mois-ci"
                badge={{ value: "+8", type: "up" }}
            />
            <StatCard
                icon={<Wallet size={24} className="text-white" />}
                iconBgColor="bg-[#e68b3c]"
                value="$850"
                label="En attente"
                subtitle="Paiements en cours"
            />
        </div>
    );
};

export default MemberCardsWidgets;
