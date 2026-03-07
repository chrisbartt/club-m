import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

// Couleurs alignées avec la maquette + harmonisées à votre palette
const ALERT_CRITIQUE = {
    bg: "bg-[#dc2626]/10",
    iconBg: "bg-[#dc2626]",
    primaryBtn: "bg-[#dc2626] text-white hover:bg-[#dc2626]/90",
};
const ALERT_AVERTISSEMENT = {
    bg: "bg-[#e68b3c]/10",
    iconBg: "bg-[#e68b3c]",
    primaryBtn: "bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90",
};

const outlineBtn = "bg-white border border-colorBorder text-colorTitle hover:bg-bgGray";

// Types
type AlertVariant = "critique" | "avertissement";

interface AlertItem {
    id: string;
    variant: AlertVariant;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
}

// Données de la maquette
const alertsData: AlertItem[] = [
    {
        id: "1",
        variant: "critique",
        title: "Tontine \"Business Ladies\" - Taux critique",
        description: "25% des membres en retard (6/24).",
        primaryLabel: "Intervenir",
        secondaryLabel: "Rappel",
    },
    {
        id: "2",
        variant: "avertissement",
        title: "Flora T. - 3 retards consécutifs",
        description: "Règle d'exclusion applicable.",
        primaryLabel: "Contacter",
        secondaryLabel: "Suspendre",
    },
];

const AlertRow = ({ variant, title, description, primaryLabel, secondaryLabel }: AlertItem) => {
    const style = variant === "critique" ? ALERT_CRITIQUE : ALERT_AVERTISSEMENT;

    return (
        <div className={`flex items-start gap-4 p-4 rounded-xl ${style.bg}`}>
            <div
                className={`w-[44px] h-[44px] rounded-full flex items-center justify-center flex-shrink-0 ${style.iconBg}`}
            >
                {variant === "critique" ? (
                    <span className="text-white text-[18px] font-bold leading-none">!</span>
                ) : (
                    <AlertTriangle size={22} className="text-white" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-colorTitle mb-1">{title}</p>
                <p className="text-[13px] text-colorMuted">{description}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                    className={`h-9 px-4 text-[13px] font-medium rounded-md shadow-none ${style.primaryBtn}`}
                >
                    {primaryLabel}
                </Button>
                <Button
                    variant="outline"
                    className={`h-9 px-4 text-[13px] font-medium rounded-md border border-colorBorder bg-white text-colorTitle hover:bg-bgGray shadow-none ${outlineBtn}`}
                >
                    {secondaryLabel}
                </Button>
            </div>
        </div>
    );
};

const CardAlert = () => {
    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden py-5 px-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Alertes Prioritaires</h3>
                </div>
                <Link
                    href="/admin/epargne-tontines/alertes"
                    className="flex items-center gap-1 text-[13px] font-medium text-colorMuted hover:text-colorTitle transition-colors"
                >
                    Voir tout <ArrowRight size={14} />
                </Link>
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
