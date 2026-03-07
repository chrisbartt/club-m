

// Types
type ActivityColor = "orange" | "blue" | "green" | "gray";

interface ActivityItem {
    id: string;
    color: ActivityColor;
    title: string;
    date: string;
}

// Activity Row Component
const ActivityRow = ({ color, title, date, isLast }: ActivityItem & { isLast: boolean }) => {
    const dotColors = {
        orange: "bg-[#e68b3c] border-[#e68b3c]",
        blue: "bg-[#3b82f6] border-[#3b82f6]",
        green: "bg-[#25a04f] border-[#25a04f]",
        gray: "bg-bgGray border-bgGray",
    };

    return (
        <div className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
                <div className={`w-[12px] h-[12px] rounded-full border-2 ${dotColors[color]}`} />
                {!isLast && <div className="w-[2px] flex-1 bg-bgGray mt-1" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-5">
                <p className="text-[14px] font-medium text-colorTitle">{title}</p>
                <p className="text-[12px] text-colorMuted">{date}</p>
            </div>
        </div>
    );
};

// Mock Data
const activitiesData: ActivityItem[] = [
    {
        id: "1",
        color: "orange",
        title: "Dernière connexion",
        date: "9 Jan 2026 - Il y a 21 jours",
    },
    {
        id: "2",
        color: "blue",
        title: "Modification BP (Marketing)",
        date: "9 Jan 2026",
    },
    {
        id: "3",
        color: "green",
        title: "Formation \"Trésorerie\" terminée",
        date: "5 Jan 2026",
    },
    {
        id: "4",
        color: "gray",
        title: "Dépôt épargne: 50 $",
        date: "26 Déc 2025",
    },
    {
        id: "5",
        color: "gray",
        title: "Coaching avec Marie Diallo",
        date: "20 Déc 2025",
    },
];

const CardActivity = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 md:px-6 px-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
                <h3 className="text-[16px] font-semibold text-colorTitle">Activité membre</h3>
            </div>

            {/* Timeline */}
            <div className="flex flex-col">
                {activitiesData.map((activity, index) => (
                    <ActivityRow
                        key={activity.id}
                        {...activity}
                        isLast={index === activitiesData.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default CardActivity;
