import { Calendar, Mail, Phone,} from "lucide-react";
import React from "react";

// Types
interface AccompItem {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    description: string;
    date: string;
    author: string;
}

// Accomp Row Component
const AccompRow = ({ icon, iconBgColor, title, description, date, author }: AccompItem) => {
    return (
        <div className="flex gap-3 p-4 bg-bgGray rounded-xl">
            {/* Icon */}
            <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0 ${iconBgColor}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1">
                <p className="text-[14px] text-colorTitle mb-1">
                    <span className="font-semibold">{title}</span>
                    <span className="text-colorMuted"> – {description}</span>
                </p>
                <p className="text-[12px] text-colorMuted">
                    {date} • {author}
                </p>
            </div>
        </div>
    );
};

// Mock Data
const accompData: AccompItem[] = [
    {
        id: "1",
        icon: <Phone size={16} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        title: "Appel Maurelle",
        description: "BP bloqué sur partie financière",
        date: "12 Jan 2026",
        author: "Maurelle A.",
    },
    {
        id: "2",
        icon: <Calendar size={16} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: "Coaching planifié",
        description: "Session prévue avec Marie D.",
        date: "15 Jan 2026",
        author: "Système",
    },
    {
        id: "3",
        icon: <Mail size={16} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: "Message envoyé",
        description: "Relance douce après 14j inactivité",
        date: "23 Jan 2026",
        author: "Maurelle A.",
    },
];

const CardHistoAccomp = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 px-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[16px] font-semibold text-colorTitle">Historique accompagnement Club M</h3>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {accompData.map((item) => (
                    <AccompRow key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
};

export default CardHistoAccomp;
