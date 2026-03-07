import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Types
interface Atelier {
    id: string;
    jour: string;
    mois: string;
    titre: string;
    inscrits: number;
    capacite: number;
    colorClass: "green" | "orange" | "red";
}

// Date Badge Component
const DateBadge = ({ jour, mois, colorClass }: { jour: string; mois: string; colorClass: string }) => {
    const bgColors = {
        green: "bg-[#25a04f]/10 text-[#25a04f]",
        orange: "bg-[#e68b3c]/10 text-[#e68b3c]",
        red: "bg-red-100 text-red-500",
    };

    return (
        <div className={`w-[44px] h-[44px] rounded-xl flex flex-col items-center justify-center  ${bgColors[colorClass as keyof typeof bgColors]}`}>
            <span className="text-[16px] font-bold leading-none">{jour}</span>
            <span className="text-[10px] uppercase">{mois}</span>
        </div>
    );
};

// Progress Bar Component
const ProgressBar = ({ inscrits, capacite, colorClass }: { inscrits: number; capacite: number; colorClass: string }) => {
    const percentage = (inscrits / capacite) * 100;
    const barColors = {
        green: "bg-[#25a04f]",
        orange: "bg-[#e68b3c]",
        red: "bg-red-500",
    };

    return (
        <div className="flex-1">
            <div className="w-full h-[6px] bg-bgGray rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${barColors[colorClass as keyof typeof barColors]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// Mock Data
const ateliersData: Atelier[] = [
    {
        id: "1",
        jour: "03",
        mois: "FÉV",
        titre: "Marketing Digital",
        inscrits: 25,
        capacite: 30,
        colorClass: "green",
    },
    {
        id: "2",
        jour: "07",
        mois: "FÉV",
        titre: "Gestion de trésorerie",
        inscrits: 22,
        capacite: 30,
        colorClass: "orange",
    },
    {
        id: "3",
        jour: "12",
        mois: "FÉV",
        titre: "Pitch & présentation",
        inscrits: 28,
        capacite: 30,
        colorClass: "red",
    },
];

const CartAtelierCoaching = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-5 pb-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Ateliers & Coaching</h3>
                </div>

                {/* Taux de remplissage */}
                <div className="flex items-baseline gap-2 mb-5">
                    <span className="md:text-[24px] text-[20px] font-bold text-colorTitle">82%</span>
                    <span className="text-[13px] text-colorMuted">Taux de remplissage global</span>
                </div>

                {/* Ateliers List */}
                <div className="flex flex-col">
                    {ateliersData.map((atelier) => (
                        <div key={atelier.id} className="flex items-center gap-4 py-4 border-t border-colorBorder">
                            <DateBadge jour={atelier.jour} mois={atelier.mois} colorClass={atelier.colorClass} />
                            <div className="flex-1 flex flex-col gap-1.5">
                                <span className="text-[14px] font-medium text-colorTitle">{atelier.titre}</span>
                                <div className="flex items-center gap-3">
                                    <ProgressBar
                                        inscrits={atelier.inscrits}
                                        capacite={atelier.capacite}
                                        colorClass={atelier.colorClass}
                                    />
                                    <span className="text-[12px] text-colorMuted whitespace-nowrap">
                                        {atelier.inscrits}/{atelier.capacite}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer - Coaching */}
            <div className="mt-auto p-4 mx-4 mb-4 bg-bgGray rounded-xl">
                <div className="flex items-center justify-between">

                    <AvatarGroup>
                        <Avatar className="w-10 h-10 border-2 border-bgCard">
                            <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Coach 1" />
                            <AvatarFallback className="bg-bgSidebar text-white text-[11px]">JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-10 h-10 border-2 border-bgCard">
                            <AvatarImage src="https://i.pravatar.cc/150?img=2" alt="Coach 2" />
                            <AvatarFallback className="bg-emerald-600 text-white text-[11px]">AM</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-10 h-10 border-2 border-bgCard">
                            <AvatarImage src="https://i.pravatar.cc/150?img=3" alt="Coach 3" />
                            <AvatarFallback className="bg-amber-500 text-white text-[11px]">SL</AvatarFallback>
                        </Avatar>
                        <AvatarGroupCount className="w-10 h-10 border-2 border-bgCard bg-bgSidebar dark:bg-primaryColor text-white text-[11px] font-semibold">
                            +3
                        </AvatarGroupCount>
                    </AvatarGroup>
                    <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-colorTitle">Coaching cette semaine</span>
                        <Link
                            href="/admin/planning"
                            className="inline-flex w-7 h-7 bg-bgCard justify-center rounded-full items-center gap-2 text-[13px] font-medium text-colorTitle hover:underline"
                        >
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default CartAtelierCoaching;
