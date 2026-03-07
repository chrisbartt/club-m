import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


// Types
interface Prestataire {
    id: string;
    rank: 1 | 2 | 3;
    nom: string;
    commandes: number;
    revenus: string;
    avatarSrc: string;
    initiales: string;
}

// Médaille : cercle avec numéro (or, argent, bronze) — couleurs projet
const MedalBadge = ({ rank }: { rank: 1 | 2 | 3 }) => {
    const config = {
        1: "bg-[#e68b3c] text-white",
        2: "bg-bgSidebar dark:bg-bgGray text-white",
        3: "bg-[#b58b72] text-white",
    };

    return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${config[rank]}`}>
            {rank}
        </div>
    );
};

// Données : Top 3 prestataires
const prestatairesData: Prestataire[] = [
    {
        id: "1",
        rank: 1,
        nom: "Keza Consulting",
        commandes: 12,
        revenus: "$1,850",
        avatarSrc: "https://i.pravatar.cc/150?img=12",
        initiales: "KC",
    },
    {
        id: "2",
        rank: 2,
        nom: "Digital Boost",
        commandes: 9,
        revenus: "$1,350",
        avatarSrc: "https://i.pravatar.cc/150?img=5",
        initiales: "DB",
    },
    {
        id: "3",
        rank: 3,
        nom: "Finance Pro",
        commandes: 7,
        revenus: "$980",
        avatarSrc: "https://i.pravatar.cc/150?img=9",
        initiales: "FP",
    },
];

const TopPrestataires = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 md:px-6 px-5 h-full">
            {/* Header */}
            <div className="pb-0">
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">Top prestataires</h3>
                </div>

                {/* Liste prestataires */}
                <div className="flex flex-col">
                    {prestatairesData.map((p) => (
                        <div
                            key={p.id}
                            className={`flex items-center gap-3 py-4 border-t border-colorBorder first:border-t-0 ${p.rank === 1 ? "" : ""
                                }`}
                        >
                            <MedalBadge rank={p.rank} />
                            <Avatar className="w-10 h-10 shrink-0">
                                <AvatarImage src={p.avatarSrc} alt={p.nom} />
                                <AvatarFallback className="bg-bgSidebar text-white text-[11px]">
                                    {p.initiales}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-semibold text-colorTitle truncate">{p.nom}</p>
                                <p className="text-[12px] text-colorMuted">
                                    {p.commandes} commandes • {p.revenus}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopPrestataires;
