"use client";

import { CheckCircle2, Calendar, DollarSign, FileText } from "lucide-react";

interface SummaryCardProps {
    icon: React.ReactNode;
    iconBgColor: string;
    label: string;
    labelColor: string;
    value: string;
    subtitle: string;
}

const SummaryCard = ({ icon, iconBgColor, label, labelColor, value, subtitle }: SummaryCardProps) => {
    return (
        <div className="bg-bgCard rounded-xl p-4 lg:p-5 flex flex-col gap-3 cardShadow h-full">
            <div className="flex items-start justify-between">
                <div className={`md:w-[48px] w-[40px] md:h-[48px] h-[40px] rounded-xl flex items-center justify-center ${iconBgColor}`}>
                    {icon}
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${labelColor}`}>
                    {label}
                </span>
            </div>
            <div>
                <div className="text-[24px] lg:text-[28px] font-bold text-colorTitle mb-1">{value}</div>
                <div className="text-[13px] text-colorMuted">{subtitle}</div>
            </div>
        </div>
    );
};

const SummaryCards = () => {
    const cards: SummaryCardProps[] = [
        {
            icon: <CheckCircle2 size={24} className="text-white" />,
            iconBgColor: "bg-[#25a04f]",
            label: "En cours",
            labelColor: "bg-[#25a04f]/10 text-[#25a04f]",
            value: "75%",
            subtitle: "Étape 3 sur 4",
        },
        {
            icon: <FileText size={24} className="text-white" />,
            iconBgColor: "bg-[#3b82f6]",
            label: "2 docs",
            labelColor: "bg-[#3b82f6]/10 text-[#3b82f6]",
            value: "2",
            subtitle: "Documents soumis",
        },
        {
            icon: <Calendar size={24} className="text-white" />,
            iconBgColor: "bg-[#e68b3c]",
            label: "Confirmé",
            labelColor: "bg-[#e68b3c]/10 text-[#e68b3c]",
            value: "16 Février — 14h",
            subtitle: "Session avec Maurelle",
        },
        {
            icon: <DollarSign size={24} className="text-white" />,
            iconBgColor: "bg-[#25a04f]",
            label: "Payé",
            labelColor: "bg-[#25a04f]/10 text-[#25a04f]",
            value: "$50",
            subtitle: "Paiement - Mobile Money",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {cards.map((card, index) => (
                <SummaryCard key={index} {...card} />
            ))}
        </div>
    );
};

export default SummaryCards;
