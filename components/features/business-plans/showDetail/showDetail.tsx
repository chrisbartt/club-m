import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useDialog } from '@/context/dialog/contextDialog';
import { useDrawer } from "@/context/drawer/contextDrawer";
import { Calendar, Check, Clock, FileText, GraduationCap, MessageCircle, TrendingUp, X } from "lucide-react";

// Mock data
const memberData = {
    initials: "MK",
    name: "Marie Kabongo",
    email: "marie.k@email.com",
    startDate: "15 Dec 2025",
    progress: 92,
    timeInvested: "12h",
    projectName: "Salon Beauté Marie",
};

const stepsData = [
    { id: 1, label: "Cadrage", status: "completed" },
    { id: 2, label: "Collecte", status: "completed" },
    { id: 3, label: "Structuration", status: "completed" },
    { id: 4, label: "Revue", status: "current" },
    { id: 5, label: "Livraison", status: "pending" },
];

const statsData = [
    { value: "92%", label: "Avancement", highlight: true },
    { value: "4/5", label: "Étapes", highlight: false },
    { value: "7/8", label: "Sections", highlight: false },
    { value: "12h", label: "Temps", highlight: false },
];

// Sections data
type SectionStatus = "completed" | "in_progress" | "pending";

interface Section {
    id: number;
    title: string;
    status: SectionStatus;
    time?: string;
}

const sectionsData: Section[] = [
    { id: 1, title: "Executive Summary", status: "completed", time: "2h" },
    { id: 2, title: "Présentation", status: "completed", time: "1h30" },
    { id: 3, title: "Analyse de marché", status: "completed", time: "3h" },
    { id: 4, title: "Stratégie commerciale", status: "completed", time: "2h" },
    { id: 5, title: "Organisation", status: "completed", time: "1h" },
    { id: 6, title: "Plan opérationnel", status: "completed", time: "1h30" },
    { id: 7, title: "Plan financier", status: "in_progress", time: "45min" },
    { id: 8, title: "Annexes", status: "pending" },
];

// Activity data
type ActivityColor = "green" | "blue" | "orange";

interface Activity {
    id: number;
    title: string;
    date: string;
    color: ActivityColor;
}

const activitiesData: Activity[] = [
    { id: 1, title: "Plan opérationnel terminé", date: "Aujourd'hui, 14:32", color: "green" },
    { id: 2, title: "Session coaching avec Marie M.", date: "Hier, 10:00", color: "blue" },
    { id: 3, title: "Organisation terminé", date: "28 Jan, 16:45", color: "green" },
    { id: 4, title: "Modifié Stratégie commerciale", date: "27 Jan, 11:20", color: "orange" },
    { id: 5, title: "Stratégie commerciale terminé", date: "26 Jan, 09:15", color: "green" },
    { id: 6, title: "Session coaching avec Marie M.", date: "24 Jan, 14:00", color: "blue" },
    { id: 7, title: "Analyse de marché terminé", date: "22 Jan, 17:30", color: "green" },
    { id: 8, title: "Rappel envoyé par l'équipe", date: "20 Jan, 09:00", color: "orange" },
];

// Coaching data
const coachData = {
    initials: "MM",
    name: "Marie Marketing",
    specialty: "Spécialiste Marketing & Stratégie",
    available: true,
};

interface CoachingSession {
    id: number;
    title: string;
    date: string;
    duration: string;
    status: "completed" | "upcoming";
}

const coachingSessionsData: CoachingSession[] = [
    { id: 1, title: "Revue Plan opérationnel", date: "Hier, 10:00", duration: "45 min", status: "completed" },
    { id: 2, title: "Stratégie commerciale", date: "24 Jan, 14:00", duration: "1h", status: "completed" },
    { id: 3, title: "Kick-off & Cadrage", date: "18 Dec, 10:00", duration: "30 min", status: "completed" },
];

// Step Circle Component
const StepCircle = ({ step }: { step: typeof stepsData[0] }) => {
    const getStepStyle = () => {
        if (step.status === "completed") {
            return "bg-[#25a04f] text-white";
        }
        if (step.status === "current") {
            return "bg-bgSidebar text-white";
        }
        return "bg-gray-200 text-gray-500";
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-[14px] font-semibold ${getStepStyle()}`}>
                {step.status === "completed" ? <Check size={20} /> : step.id}
            </div>
            <span className="text-[12px] text-colorTitle">{step.label}</span>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ value, label, highlight }: { value: string; label: string; highlight: boolean }) => {
    return (
        <div className={`flex flex-col items-center justify-center p-4 rounded-xl ${highlight ? "bg-[#25a04f]/10" : "bg-bgGray"}`}>
            <span className={`text-[20px] font-bold ${highlight ? "text-[#25a04f]" : "text-colorTitle"}`}>
                {value}
            </span>
            <span className="text-[12px] text-colorMuted">{label}</span>
        </div>
    );
};

// Progress Badge Component
const ProgressBadge = ({ value, timeInvested }: { value: number; timeInvested: string }) => {
    return (
        <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[14px] font-semibold bg-[#25a04f]/10 text-[#25a04f]">
                <span className="w-2 h-2 rounded-full bg-[#25a04f]" />
                {value}%
            </span>
            <span className="text-[12px] text-colorMuted">{timeInvested} investies</span>
        </div>
    );
};

// Section Card Component
const SectionCard = ({ section }: { section: Section }) => {
   

    const getStatusIcon = () => {
        if (section.status === "completed") {
            return (
                <div className="w-[32px] h-[32px] rounded-full bg-[#25a04f]/10 flex items-center justify-center">
                    <Check size={18} className="text-[#25a04f]" />
                </div>
            );
        }
        if (section.status === "in_progress") {
            return (
                <div className="w-[32px] h-[32px] rounded-full bg-[#e68b3c]/10 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#e68b3c]" />
                </div>
            );
        }
        return (
            <div className="w-[32px] h-[32px] rounded-full bg-gray-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
            </div>
        );
    };

    const getStatusLabel = () => {
        if (section.status === "completed") return "Terminé";
        if (section.status === "in_progress") return "En cours";
        return "À faire";
    };

    return (
        <div className={`flex items-center gap-3 p-4 bg-bgGray rounded-xl`}>
            {getStatusIcon()}
            <div className="flex-1">
                <p className="text-[14px] font-semibold text-colorTitle">{section.title}</p>
                <p className="text-[12px] text-colorMuted">
                    {getStatusLabel()}
                    {section.time && ` • ${section.time}`}
                </p>
            </div>
        </div>
    );
};

// Activity Row Component
const ActivityRow = ({ activity, isLast }: { activity: Activity; isLast: boolean }) => {
    const dotColors = {
        green: "bg-[#25a04f]",
        blue: "bg-bgSidebar",
        orange: "bg-[#e68b3c]",
    };

    return (
        <div className="flex gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${dotColors[activity.color]}`} />
                {!isLast && <div className="w-[2px] flex-1 bg-gray-200 my-1" />}
            </div>
            {/* Content */}
            <div className="pb-5">
                <p className="text-[14px] text-colorTitle" dangerouslySetInnerHTML={{ __html: activity.title.replace(/(\w+)(?= terminé| commerciale)/, '<strong>$1</strong>') }} />
                <p className="text-[12px] text-colorMuted">{activity.date}</p>
            </div>
        </div>
    );
};

// Coaching Session Card Component
const CoachingSessionCard = ({ session }: { session: CoachingSession }) => {
    return (
        <div className="flex items-center gap-4 p-4 bg-bgGray rounded-xl border-l-4 border-l-[#8c49b1]">
            <div className="w-[48px] h-[48px] rounded-full bg-[#8c49b1] flex items-center justify-center text-white text-[14px] font-semibold">
                MM
            </div>
            <div className="flex-1">
                <p className="text-[14px] font-semibold text-colorTitle">{session.title}</p>
                <p className="text-[12px] text-colorMuted">{session.date} • {session.duration}</p>
            </div>
            <span className="px-3 py-1 rounded-md text-[12px] font-medium bg-[#25a04f] text-white">
                Terminé
            </span>
        </div>
    );
};

const ShowDetail = () => {
    const { isDrawerOpen, closeDrawer } = useDrawer();
    const { openDialog } = useDialog();
    return (
        <Sheet
            open={isDrawerOpen("ShowDetail")}
            onOpenChange={() => closeDrawer("ShowDetail")}
        >
            <SheetContent className="border-0 bg-bgCard w-[640px] max-w-[100%!important] sm:max-w-[100%!important] [&>button]:hidden p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 py-4 border-b border-colorBorder">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-[18px] font-semibold text-colorTitle">
                            {memberData.projectName}
                        </SheetTitle>
                        <Button
                            onClick={() => closeDrawer("ShowDetail")}
                            className="p-2 h-auto cursor-pointer rounded-full bg-transparent hover:bg-bgGray hover:text-colorTitle transition-colors group shadow-none"
                            aria-label="Fermer"
                        >
                            <X className="h-5 w-5 text-colorMuted group-hover:text-colorTitle" />
                        </Button>
                    </div>
                </SheetHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Member Info Block */}
                    <div className="flex items-center justify-between p-4 border border-colorBorder border-dashed rounded-xl mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-[56px] h-[56px] rounded-full bg-bgSidebar flex items-center justify-center text-white text-[18px] font-semibold">
                                {memberData.initials}
                            </div>
                            <div>
                                <p className="text-[15px] font-semibold text-colorTitle">{memberData.name}</p>
                                <p className="text-[13px] text-colorMuted">{memberData.email}</p>
                                <p className="text-[12px] text-colorMuted">Démarré le {memberData.startDate}</p>
                            </div>
                        </div>
                        <ProgressBadge value={memberData.progress} timeInvested={memberData.timeInvested} />
                    </div>

                    {/* Tabs Section */}
                    <Tabs defaultValue="evolution" className="w-full">
                        <TabsList className="w-full h-auto p-1 bg-bgGray rounded-lg mb-5">
                            <TabsTrigger
                                value="evolution"
                                className="flex-1 py-2 text-[13px] gap-1.5 data-[state=active]:bg-bgCard data-[state=active]:text-colorTitle data-[state=active]:!shadow-none rounded-md cursor-pointer"
                            >
                                <TrendingUp size={14} />
                                Évolution
                            </TabsTrigger>
                            <TabsTrigger
                                value="sections"
                                className="flex-1 py-2 text-[13px] gap-1.5 data-[state=active]:bg-bgCard data-[state=active]:text-colorTitle data-[state=active]:!shadow-none rounded-md cursor-pointer"
                            >
                                <FileText size={14} />
                                Sections
                            </TabsTrigger>
                            <TabsTrigger
                                value="activite"
                                className="flex-1 py-2 text-[13px] gap-1.5 data-[state=active]:bg-bgCard data-[state=active]:text-colorTitle data-[state=active]:!shadow-none rounded-md cursor-pointer"
                            >
                                <Clock size={14} />
                                Activité
                            </TabsTrigger>
                            <TabsTrigger
                                value="coaching"
                                className="flex-1 py-2 text-[13px] gap-1.5 data-[state=active]:bg-bgCard data-[state=active]:text-colorTitle data-[state=active]:!shadow-none rounded-md cursor-pointer"
                            >
                                <GraduationCap size={14} />
                                Coaching
                            </TabsTrigger>
                        </TabsList>

                        {/* Evolution Tab Content */}
                        <TabsContent value="evolution" className="mt-0">
                            {/* Parcours BP */}
                            <div className="mb-5">
                                <h4 className="text-base font-semibold text-colorTitle tracking-wide mb-4 flex items-center gap-1">
                                    Parcours BP (5 étapes)
                                </h4>
                                <div className="flex items-center justify-between">
                                    {stepsData.map((step, index) => (
                                        <div key={step.id} className="flex items-center">
                                            <StepCircle step={step} />
                                            {index < stepsData.length - 1 && (
                                                <div className={`w-[20px] h-[2px] mx-1 ${step.status === "completed" ? "bg-[#25a04f]" : "bg-gray-200"}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Statistiques */}
                            <div className="mb-5">
                                <h4 className="text-base font-semibold text-colorTitle tracking-wide mb-4 flex items-center gap-1">
                                    Statistiques
                                </h4>
                                <div className="grid grid-cols-4 gap-3">
                                    {statsData.map((stat, index) => (
                                        <StatCard key={index} {...stat} />
                                    ))}
                                </div>
                            </div>

                            {/* Message Rapide */}
                            <div>
                                <h4 className="text-base font-semibold text-colorTitle tracking-wide mb-4 flex items-center gap-1">
                                    Actions rapides
                                </h4>
                                <div className="flex items-center gap-3">
                                    <Button onClick={() => openDialog("messageDialog")} className="h-10 px-4 bg-[#25a04f] text-white hover:bg-[#25a04f]/90 gap-2 shadow-none">
                                        <MessageCircle size={16} />
                                        Envoyer un message
                                    </Button>
                                    <Button variant="outline" className="h-10 px-4 border-colorBorder text-colorTitle hover:bg-bgGray gap-2 shadow-none">
                                        <Calendar size={16} />
                                        Planifier RDV
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Sections Tab Content */}
                        <TabsContent value="sections" className="mt-0">
                            <h4 className="text-base font-semibold text-colorTitle tracking-wide mb-4 flex items-center gap-2">
                                8 sections du Business Plan
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {sectionsData.map((section) => (
                                    <SectionCard key={section.id} section={section} />
                                ))}
                            </div>
                        </TabsContent>

                        {/* Activité Tab Content */}
                        <TabsContent value="activite" className="mt-0">
                            <h4 className="text-base font-semibold text-colorTitle tracking-wide mb-4 flex items-center gap-2">
                                Historique d&apos;activité
                            </h4>
                            <div className="flex flex-col">
                                {activitiesData.map((activity, index) => (
                                    <ActivityRow
                                        key={activity.id}
                                        activity={activity}
                                        isLast={index === activitiesData.length - 1}
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        {/* Coaching Tab Content */}
                        <TabsContent value="coaching" className="mt-0">
                            {/* Coach Assigné */}
                            <div className="mb-6">
                                <h4 className="text-base font-semibold text-colorTitle tracking-wide mb-4 flex items-center gap-2">
                                    Coach assigné
                                </h4>
                                <div className="flex items-center justify-between p-4 bg-bgGray rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-[56px] h-[56px] rounded-full bg-[#8c49b1] flex items-center justify-center text-white text-[18px] font-semibold">
                                            {coachData.initials}
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold text-colorTitle">{coachData.name}</p>
                                            <p className="text-[13px] text-colorMuted">{coachData.specialty}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1.5 rounded-md text-[12px] font-medium bg-[#25a04f] text-white">
                                        Disponible
                                    </span>
                                </div>
                            </div>

                            {/* Sessions de Coaching */}
                            <div className="mb-6">
                                <h4 className="text-base font-semibold text-colorTitle tracking-wide mb-4 flex items-center gap-2">
                                    Sessions de coaching ({coachingSessionsData.length})
                                </h4>
                                <div className="flex flex-col gap-3">
                                    {coachingSessionsData.map((session) => (
                                        <CoachingSessionCard key={session.id} session={session} />
                                    ))}
                                </div>
                            </div>

                            {/* Planifier Button */}
                            <Button className="w-full h-12 cursor-pointer bg-primaryColor text-white hover:bg-primaryColor/90 gap-2 shadow-none text-[14px] font-medium" onClick={() => openDialog("coachingDialog")}>
                                📅 Planifier une session
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ShowDetail;
