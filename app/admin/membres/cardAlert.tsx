import {
    ArrowUpCircle,
    FileText,
    PiggyBank,
    UserPlus,
    Users,
} from "lucide-react";
import React from "react";

// Types
interface ActivityItem {
    id: string;
    icon: React.ReactNode;
    iconBgColor: string;
    title: React.ReactNode;
    subtitle: string;
}

// Activity Row Component
const ActivityRow = ({ item }: { item: ActivityItem }) => {
    return (
        <div className="flex items-center gap-4 py-5 border-b border-colorBorder">
            {/* Icon */}
            <div className={`md:w-[48px] w-[40px] md:h-[48px] h-[40px] rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconBgColor}`}>
                {item.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-[14px] text-colorTitle">{item.title}</p>
                <p className="text-[13px] text-colorMuted">{item.subtitle}</p>
            </div>
        </div>
    );
};

// Activities Data
const activitiesData: ActivityItem[] = [
    {
        id: "1",
        icon: <FileText size={22} className="text-[#3b82f6]" />,
        iconBgColor: "bg-[#3b82f6]/10",
        title: (
            <>
                <span className="font-bold">23 membres</span> ont avancé sur leur BP
            </>
        ),
        subtitle: "Ces 7 derniers jours",
    },
    {
        id: "2",
        icon: <PiggyBank size={22} className="text-[#25a04f]" />,
        iconBgColor: "bg-[#25a04f]/10",
        title: (
            <>
                <span className="font-bold">45 dépôts</span> effectués (2,340 $)
            </>
        ),
        subtitle: "Ces 7 derniers jours",
    },
    {
        id: "3",
        icon: <UserPlus size={22} className="text-[#8c49b1]" />,
        iconBgColor: "bg-[#8c49b1]/10",
        title: (
            <>
                <span className="font-bold">18 nouvelles</span> inscriptions
            </>
        ),
        subtitle: "Cette semaine",
    },
    {
        id: "4",
        icon: <Users size={22} className="text-[#e68b3c]" />,
        iconBgColor: "bg-[#e68b3c]/10",
        title: (
            <>
                <span className="font-bold">8 sessions</span> coaching réalisées
            </>
        ),
        subtitle: "Cette semaine",
    },
    {
        id: "5",
        icon: <ArrowUpCircle size={22} className="text-[#00b8db]" />,
        iconBgColor: "bg-[#00b8db]/10",
        title: (
            <>
                <span className="font-bold">6 upgrades</span> de statut
            </>
        ),
        subtitle: "Ces 14 derniers jours",
    },
];

const CardAlert = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 md:px-6 px-5 h-full">
            {/* Header */}
            <div className="flex items-center gap-2 pb-4 border-b border-colorBorder">
                <h3 className="text-[16px] font-semibold text-colorTitle">Activité récente</h3>
            </div>

            {/* Activities List */}
            <div className="flex flex-col">
                {activitiesData.map((item) => (
                    <ActivityRow key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default CardAlert;
