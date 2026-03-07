"use client";

import { Calendar, Clock, Video, ArrowRight, MessageSquare, FileText, CheckCircle2, Lightbulb } from "lucide-react";
import Link from "next/link";

// Composant Prochain Rendez-vous
const ProchainRendezVous = () => {
    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow md:mb-4 mb-3">
            <h3 className="text-[16px] font-semibold text-colorTitle mb-4">
                Prochain rendez-vous
            </h3>
            <div className="mb-4">
                <h4 className="text-[14px] font-medium text-colorTitle mb-4">
                    Session feedback avec Maurelle
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[13px] text-colorMuted">
                        <Calendar size={16} />
                        <span>Session Business Aligné</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-colorMuted">
                        <Clock size={16} />
                        <span>1h de visioconférence</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-colorMuted">
                        <Calendar size={16} />
                        <span>Lundi 16 Février</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-colorMuted">
                        <Clock size={16} />
                        <span>14:00 - 15:00</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-colorMuted">
                        <Video size={16} />
                        <span>Zoom</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Link
                    href="#"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primaryColor hover:bg-primaryColor/90 text-white font-medium rounded-lg transition-colors text-[13px]"
                >
                    <Video size={16} />
                    Rejoindre
                </Link>
                <Link
                    href="#"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-bgCard border border-colorBorder hover:bg-bgGray text-colorTitle font-medium rounded-lg transition-colors text-[13px]"
                >
                    Reporter
                </Link>
            </div>
        </div>
    );
};

// Composant Actions Rapides
const ActionsRapides = () => {
    const actions = [
        {
            icon: <MessageSquare size={18} className="text-primaryColor" />,
            titre: "Contacter Maurelle",
            subtitle: "Poser une question",
            href: "/membre/messages",
        },
        {
            icon: <FileText size={18} className="text-[#3b82f6]" />,
            titre: "Mes documents",
            subtitle: "Formulaire, rapport, restitution",
            href: "#",
        },
        {
            icon: <CheckCircle2 size={18} className="text-[#25a04f]" />,
            titre: "Modifier mon profil",
            subtitle: "Situation, objectifs, contact",
            href: "#",
            hasCheck: true,
        },
        {
            icon: <Lightbulb size={18} className="text-[#e68b3c]" />,
            titre: "Guide du parcours",
            subtitle: "FAQ et conseils",
            href: "#",
        },
    ];

    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow md:mb-4 mb-3">
            <h3 className="text-[16px] font-semibold text-colorTitle mb-4">
                Actions rapides
            </h3>
            <div className="space-y-2">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-bgGray transition-colors group"
                    >
                        <div className="w-[40px] h-[40px] rounded-lg bg-bgGray flex items-center justify-center flex-shrink-0">
                            {action.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-[14px] font-medium text-colorTitle">{action.titre}</p>
                                {action.hasCheck && (
                                    <CheckCircle2 size={14} className="text-[#25a04f]" />
                                )}
                            </div>
                            <p className="text-[12px] text-colorMuted">{action.subtitle}</p>
                        </div>
                        <ArrowRight size={16} className="text-colorMuted group-hover:text-colorTitle transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

// Composant Ma Progression
const MaProgression = () => {
    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow md:mb-4 mb-3">
            <h3 className="text-[16px] font-semibold text-colorTitle mb-4">
                Ma progression
            </h3>
            <div className="flex flex-col items-center">
                <div className="relative w-[120px] h-[120px] mb-4">
                    <svg className="transform -rotate-90 w-full h-full">
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-bgGray"
                        />
                        <circle
                            cx="60"
                            cy="60"
                            r="50"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 50}`}
                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.75)}`}
                            className="text-primaryColor"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[32px] font-bold text-colorTitle">75%</span>
                    </div>
                </div>
                <p className="text-[14px] text-colorMuted text-center mb-3">
                    Parcours avancé - 3 étapes sur 4 complétées
                </p>
                <div className="w-full h-[6px] bg-bgGray rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primaryColor rounded-full transition-all duration-500"
                        style={{ width: "75%" }}
                    />
                </div>
            </div>
        </div>
    );
};

// Composant Conseil
const ConseilSession = () => {
    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow md:mb-4 mb-3">
            <div className="flex gap-3">
                <div className="w-[40px] h-[40px] rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={20} className="text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-[16px] font-semibold text-colorTitle mb-2">
                        Conseil pour ta session
                    </h3>
                    <p className="text-[14px] text-colorMuted leading-relaxed">
                        Prépare 3 à 5 questions clés que tu souhaites aborder avec Maurelle. Pense à tes doutes principaux sur la viabilité de ton idée et la différenciation de ton projet.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Composant Principal
const SidebarBusinessAligne = () => {
    return (
        <div className="flex flex-col">
            <ProchainRendezVous />
            <ActionsRapides />
            <MaProgression />
            <ConseilSession />
        </div>
    );
};

export default SidebarBusinessAligne;
