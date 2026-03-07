import { Button } from "@/components/ui/button";
import { AlertCircle, MessageCircle, ThumbsUp, Zap ,Heart, Clock, OctagonAlert } from "lucide-react";
import React from "react";

// Types
type AlertType = "critique" | "a_relancer" | "a_encourager";

interface AlertItem {
    id: string;
    type: AlertType;
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    description: string;
    secondaryInfo: string;
    button: {
        label: string;
        icon?: React.ReactNode;
        variant: "critique" | "relancer" | "encourager";
    };
}

// Alert Row Component
const AlertRow = ({ type, icon, iconBgColor, title, description, secondaryInfo, button }: AlertItem) => {
    const bgColors = {
        critique: "bg-[#dd3d3d]/10",
        a_relancer: "bg-[#e68b3c]/10",
        a_encourager: "bg-[#25a04f]/10",
    };

    const buttonStyles = {
        critique: "bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 cursor-pointer",
        relancer: "bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90 cursor-pointer",
        encourager: "bg-[#25a04f] text-white hover:bg-[#25a04f]/90 cursor-pointer",
    };

    return (
        <div className={`flex items-start gap-4 p-4 rounded-xl ${bgColors[type]}`}>
            {/* Icon */}
            <div className={`w-[44px] h-[44px] rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-colorTitle mb-1">{title}</p>
                <p className="text-[13px] text-colorMuted mb-1">{description}</p>
                <p className={`text-[12px] ${type === "a_encourager" ? "text-colorMuted" : "text-[#e68b3c]"}`}>{secondaryInfo}</p>
            </div>

            {/* Button */}
            <Button
                className={`h-9 px-4 text-[13px] font-medium gap-2 shadow-none flex-shrink-0 ${buttonStyles[button.variant]}`}
            >
                {button.icon}
                {button.label}
            </Button>
        </div>
    );
};

// Mock Data
const alertsData: AlertItem[] = [
    {
        id: "1",
        type: "critique",
        icon: <OctagonAlert size={20} className="text-[#dd3d3d]" />,
        iconBgColor: "bg-[#dd3d3d]/10",
        title: "Flora Tshimanga - Inactive depuis 12 jours",
        description: "BP \"Flora Boutique\" • Étape: Stratégie marketing",
        secondaryInfo: "Avancement: 28% • Coach: Sophie Morel",
        button: {
            label: "Relancer maintenant",
            icon: <Zap size={14} />,
            variant: "critique",
        },
    },
    {
        id: "2",
        type: "critique",
        icon: <OctagonAlert size={20} className="text-[#dd3d3d]" />,
        iconBgColor: "bg-[#dd3d3d]/10",
        title: "Diane Mwamba - Inactive depuis 9 jours",
        description: "BP \"Diane Events\" • Étape: Analyse concurrentielle",
        secondaryInfo: "Avancement: 45% • Coach: Non assigné",
        button: {
            label: "Relancer maintenant",
            icon: <Zap size={14} />,
            variant: "critique",
        },
    },
    {
        id: "3",
        type: "a_relancer",
        icon: <Clock size={20} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/20",
        title: "Aline Makoso - Inactive depuis 8 jours",
        description: "BP \"Boutique Aline Mode\" • Étape: Étude de marché",
        secondaryInfo: "Avancement: 35% • Coach: Marie Marketing",
        button: {
            label: "Relancer",
            icon: <MessageCircle size={14} />,
            variant: "relancer",
        },
    },
    {
        id: "4",
        type: "a_relancer",
        icon: <Clock size={20} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/20",
        title: "Sophie Kabongo - Inactive depuis 7 jours",
        description: "BP \"Sophie Pâtisserie\" • Étape: Business Model",
        secondaryInfo: "Avancement: 52% • Coach: Sophie Morel",
        button: {
            label: "Relancer",
            icon: <MessageCircle size={14} />,
            variant: "relancer",
        },
    },
    {
        id: "5",
        type: "a_encourager",
        icon: <Heart size={20} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/20",
        title: "Marie Kabongo - À 92% !",
        description: "BP \"Salon Beauté Marie\" • Dernière étape: Finalisation",
        secondaryInfo: "Un petit message d'encouragement ?",
        button: {
            label: "Encourager",
            icon: <ThumbsUp size={14} />,
            variant: "encourager",
        },
    },
];

const CardAlert = () => {
    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden py-5 px-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Alertes prioritaires</h3>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {alertsData.map((item) => (
                    <AlertRow key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
};

export default CardAlert;
