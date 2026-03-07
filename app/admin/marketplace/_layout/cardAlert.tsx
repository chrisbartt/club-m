import { AlarmClock, ArrowRight, Package } from "lucide-react";
import Link from "next/link";

// Couleurs alignées avec la maquette + palette projet (fond carte + cercle icône plein, icône blanche)
const ALERT_LITIGE = {
    bg: "bg-[#dc2626]/10",
    iconBg: "bg-[#dd3d3d]",
};
const ALERT_DELAI = {
    bg: "bg-[#e68b3c]/10",
    iconBg: "bg-[#e68b3c]",
};
const ALERT_LIVRAISON = {
    bg: "bg-[#b58b72]/10",
    iconBg: "bg-[#b58b72]",
};

// Types
type AlertVariant = "litige" | "delai" | "livraison";

interface AlertItem {
    id: string;
    variant: AlertVariant;
    title: string;
    mainDescription: string;
    timeDetails: string;
}

// Données marketplace (maquette)
const alertsData: AlertItem[] = [
    {
        id: "1",
        variant: "litige",
        title: "Litige ouvert - Délai critique",
        mainDescription: "CMD-2025-0456 • Sophie M. vs Keza Consulting",
        timeDetails: "Il y a 2h • Décision requise sous 24h",
    },
    {
        id: "2",
        variant: "delai",
        title: "Délai 48h expiré",
        mainDescription: "CMD-2025-0461 • Validation automatique imminente",
        timeDetails: "Il y a 30 min",
    },
    {
        id: "3",
        variant: "livraison",
        title: "Livraison effectuée",
        mainDescription: "CMD-2025-0463 • En attente de validation client",
        timeDetails: "Il y a 1h",
    },
];

const AlertRow = ({
    variant,
    title,
    mainDescription,
    timeDetails,
}: AlertItem) => {
    const style =
        variant === "litige"
            ? ALERT_LITIGE
            : variant === "delai"
                ? ALERT_DELAI
                : ALERT_LIVRAISON;

    return (
        <div className={`flex items-start gap-4 p-4 rounded-xl ${style.bg}`}>
            <div
                className={`w-[44px] h-[44px] rounded-full flex items-center justify-center flex-shrink-0 ${style.iconBg}`}
            >
                {variant === "litige" && (
                    <span className="text-white text-[18px] font-bold leading-none">
                        !
                    </span>
                )}
                {variant === "delai" && (
                    <AlarmClock size={22} className="text-white" />
                )}
                {variant === "livraison" && (
                    <Package size={22} className="text-white" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-colorTitle mb-1">
                    {title}
                </p>
                <p className="text-[13px] text-colorMuted">{mainDescription}</p>
                <p className="text-[13px] text-colorMuted mt-0.5">
                    {timeDetails}
                </p>
            </div>
        </div>
    );
};

const CardAlert = () => {
    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden py-5 md:px-6 px-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">
                        Alertes Prioritaires
                    </h3>
                </div>
                <Link
                    href="/admin/marketplace/alertes-notifications"
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
