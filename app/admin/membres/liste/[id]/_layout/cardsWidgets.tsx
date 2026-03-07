import {
    Clock,
    LogIn,
    MousePointer2,
    Star,
} from "lucide-react";
import React from "react";

// Types
interface StatCardProps {
    icon: React.ReactNode;
    iconBgColor: string;
    value: string | number;
    label: string;
}

// Stat Card Component
const StatCard = ({ icon, iconBgColor, value, label }: StatCardProps) => {
    return (
        <div className="bg-bgCard rounded-xl md:p-5 p-4 flex flex-col gap-4 cardShadow h-full">
            {/* Icon */}
            <div className={`md:w-[48px] w-[40px] md:h-[48px] h-[40px] rounded-xl flex items-center justify-center ${iconBgColor}`}>
                {icon}
            </div>

            {/* Value */}
            <p className="md:text-[32px] text-[28px] font-bold text-colorTitle leading-none">{value}</p>

            {/* Label */}
            <p className="text-[14px] text-colorMuted">{label}</p>
        </div>
    );
};

// Cards Data
const cardsData: StatCardProps[] = [
    {
        icon: <LogIn size={22} className="text-white" />,
        iconBgColor: "bg-[#3b82f6]",
        value: "89",
        label: "Connexions",
    },
    {
        icon: <MousePointer2 size={22} className="text-white" />,
        iconBgColor: "bg-[#25a04f]",    
        value: "312",
        label: "Actions",
    },
    {
        icon: <Clock size={22} className="text-white" />,
        iconBgColor: "bg-[#8c49b1]",
        value: "28h",
        label: "Temps",
    },
    {
        icon: <Star size={22} className="text-white" />,
        iconBgColor: "bg-[#e68b3c]",
        value: "92%",
        label: "Engagement",
    },
];

// Main Component
const CardsWidgets = () => {
    return (
        <div className="cards-widgets">
            {/* Cards Row - 4 Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-4 gap-3">
                {cardsData.map((card, index) => (
                    <StatCard key={index} {...card} />
                ))}
            </div>
        </div>
    );
};

export default CardsWidgets;
