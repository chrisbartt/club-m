import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

export type EventTypeKey =
    | "ateliers"
    | "lunchs"
    | "conferences"
    | "formations"
    | "networking"
    | "autre";

// Couleurs du thème par type : bleu, orange, vert, mauve + variantes
const TYPE_COLORS: Record<EventTypeKey, string> = {
    ateliers: "#a55b46",   // orange (primaryColor)
    lunchs: "#25a04f",     // vert
    conferences: "#e68b3c", // bleu (bgSidebar)
    formations: "#8c49b1", // mauve
    networking: "#3b82f6", // vert foncé (darkenGreen)
    autre: "colorTitle",      // bleu foncé (colorDarkBlue)
};

export interface CardEventProps {
    type: EventTypeKey;
    typeLabel: string;
    date: string;
    title: string;
    location: string;
    image?: string;
    /** Prix unique (affiché tel quel) ou fourchette si priceMax fourni et différent */
    priceMin: number;
    priceMax?: number;
}

function formatPrice(priceMin: number, priceMax?: number): string {
    if (priceMax != null && priceMax !== priceMin) {
        return `${priceMin}$ - ${priceMax}$`;
    }
    return `${priceMin}$`;
}

const CardEvent = ({
    type,
    typeLabel,
    date,
    title,
    location,
    image = "/images/banner3.jpg",
    priceMin,
    priceMax,
}: CardEventProps) => {
    const color = TYPE_COLORS[type];
    const priceLabel = formatPrice(priceMin, priceMax);

    return (
        <div className="card-event bg-bgCard rounded-xl p-2">
            <div className="card-img lg:h-[200px] h-[150px] relative z-10">
                <div className="flex items-center p-2">
                    <div
                        className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-bgCard rounded-full px-2 py-1"
                        style={{ color }}
                    >
                        <div
                            className="bubble w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                        />
                        {typeLabel}
                    </div>
                </div>
                <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="price bg-bgSidebar text-white flex items-center justify-center min-w-[60px] h-[40px] rounded-xl font-semibold absolute -bottom-4 right-3 px-2 text-center text-[13px] overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
                    {priceLabel}
                </div>
            </div>
            <div className="card-content p-3">
                <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={16} className="text-colorMuted" />
                    <span className="text-sm text-colorMuted">{date}</span>
                </div>
                <h3 className="lg:text-[16px] text-colorTitle font-medium mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="text-sm text-colorMuted flex items-center gap-1">
                    <MapPin size={16} className="text-colorMuted" />
                    <span className="text-sm text-colorMuted">{location}</span>
                </p>
            </div>
        </div>
    );
};

export default CardEvent;