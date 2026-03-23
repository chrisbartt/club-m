import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, Crown, Mail, MapPin, Phone } from "lucide-react";
import { useDialog } from '@/context/dialog-context';
// Types
interface MemberData {
    initials: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    memberSince: string;
    sector: string;
    status: "Business" | "Premium" | "Free";
    lastConnection: string;
}

// Mock data (à remplacer par les vraies données)
const memberData: MemberData = {
    initials: "MK",
    name: "Marie Kabila",
    email: "marie.kabila@email.com",
    phone: "+243 99 345 6789",
    location: "Kinshasa, Ngaliema",
    memberSince: "Juil. 2025",
    sector: "Agroalimentaire",
    status: "Business",
    lastConnection: "aujourd'hui",
};

// Status Badge Component
const StatusBadge = ({ status }: { status: MemberData["status"] }) => {
    const config = {
        Business: {
            label: "Business",
            className: "bg-[#e68b3c] text-white",
            icon: <Crown size={14} />,
        },
        Premium: {
            label: "Premium",
            className: "bg-[#8c49b1] text-white",
            icon: <Crown size={14} />,
        },
        Free: {
            label: "Free",
            className: "bg-[#25a04f] text-white",
            icon: null,
        },
    };

    const { label, className, icon } = config[status];

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium ${className}`}>
            {icon}
            {label}
        </span>
    );
};

const Header = () => {
    const { openDialog } = useDialog();
    return (
        <div className="card cardShadow w-full bg-bgSidebar rounded-xl overflow-hidden py-6 px-8 relative z-10">
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Avatar */}
                <div className="w-[100px] h-[100px] rounded-full bg-[#d4a853] flex items-center justify-center text-bgSidebar text-[28px] font-bold flex-shrink-0">
                    {memberData.initials}
                </div>

                {/* Info */}
                <div className="flex-1">
                    {/* Name & Status Badge */}
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-[24px] font-semibold text-white">
                            {memberData.name}
                        </h1>
                        <StatusBadge status={memberData.status} />
                    </div>

                    {/* Email */}
                    <p className="text-[14px] text-white/70 mb-1">{memberData.email}</p>

                    {/* Last Connection */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[12px] text-white mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Dernière connexion : {memberData.lastConnection}</span>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-white/80">
                        <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{memberData.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span>{memberData.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Membre depuis {memberData.memberSince}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase size={14} />
                            <span>{memberData.sector}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Button className="h-9 px-4 bg-bgSidebar border border-white/20 text-white hover:bg-white/10 gap-2 shadow-none" onClick={() => openDialog("messageDialog")}>
                            <Mail size={16} />
                            Message
                        </Button>
                        <Button className="h-9 px-4 bg-[#25a04f] text-white hover:bg-[#25a04f]/90 gap-2 shadow-none" onClick={() => openDialog("coachingDialog")}>
                            <Calendar size={16} />
                            Coaching
                        </Button>
                        <Button className="h-9 px-4 bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90 gap-2 shadow-none">
                            <Phone size={16} />
                            Appeler
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
