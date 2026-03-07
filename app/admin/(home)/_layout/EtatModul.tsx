import { CalendarDays, FileText, PiggyBank, Store } from "lucide-react";
import React from "react";

// Types
interface ModuleData {
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    percentage: number;
    progressColor: string;
    membresActifs: string;
    evolution: string;
}

// Module Row Component
const ModuleRow = ({ icon, iconBgColor, title, percentage, progressColor, membresActifs, evolution }: ModuleData) => {
    return (
        <div className="module-row py-4 border-t border-colorBorder">
            {/* Header */}
            <div className="flex justify-between md:flex-row flex-col md:items-center gap-2 md:gap-0">
                <div className="flex items-center gap-3">
                    <div className={`w-[32px] h-[32px] rounded-lg flex items-center justify-center ${iconBgColor}`}>
                        {icon}
                    </div>
                    <div>
                        <span className="text-[14px] font-semibold text-colorTitle block mb-1">{title}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-colorMuted text-[12px] block">{membresActifs} membres actifs</span>
                            <span className="text-green-600 font-medium text-[12px]">{evolution} ce mois</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Progress Bar */}
                    <div className="md:w-[100px] w-full h-[6px] bg-bgGray rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <span className="text-[12px] font-bold text-colorTitle">{percentage}%</span>
                </div>

            </div>

        </div>
    );
};

// Mock Data
const modulesData: ModuleData[] = [
    {
        icon: <FileText size={16} className="text-[#3b82f6]" />,
        iconBgColor: "bg-[#3b82f6]/10",
        title: "Business Plan",
        percentage: 72,
        progressColor: "bg-[#3b82f6]",
        membresActifs: "925",
        evolution: "+8%",
    },
    {
        icon: <PiggyBank size={16} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: "Tontines",
        percentage: 46,
        progressColor: "bg-[#e68b3c]",
        membresActifs: "591",
        evolution: "+12%",
    },
    {
        icon: <CalendarDays size={16} className="text-[#8c49b1]" />,
        iconBgColor: "bg-[#8c49b1]/10",
        title: "Ateliers & Événements",
        percentage: 81,
        progressColor: "bg-[#8c49b1]",
        membresActifs: "1,040",
        evolution: "+5%",
    },
    {
        icon: <Store size={16} className="text-[#00b8db]" />,
        iconBgColor: "bg-[#00b8db]/10",
        title: "Annuaire / Marketplace",
        percentage: 38,
        progressColor: "bg-[#00b8db]",
        membresActifs: "488",
        evolution: "+15%",
    },
];

const EtatModul = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 md:px-6 px-5  h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-[16px] font-semibold text-colorTitle">Utilisation des modules</h3>
            </div>

            {/* Modules List */}
            <div className="flex flex-col">
                {modulesData.map((module, index) => (
                    <ModuleRow key={index} {...module} />
                ))}
            </div>
        </div>
    );
};

export default EtatModul;
