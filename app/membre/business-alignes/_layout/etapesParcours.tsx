"use client";

import { CheckCircle2, Calendar, ArrowRight, Video } from "lucide-react";
import Link from "next/link";

interface EtapeProps {
    numero: number;
    titre: string;
    status: "valide" | "en_cours" | "a_venir";
    description: string;
    date?: string;
    actions?: {
        label: string;
        href: string;
        variant?: "primary" | "secondary";
    }[];
}

const Etape = ({ numero, titre, status, description, date, actions }: EtapeProps) => {
    const getStatusBadge = () => {
        switch (status) {
            case "valide":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
                        <CheckCircle2 size={12} />
                        Validé
                    </span>
                );
            case "en_cours":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#e68b3c]/10 text-[#e68b3c]">
                        En cours
                    </span>
                );
            case "a_venir":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-bgGray text-colorMuted">
                        À venir
                    </span>
                );
        }
    };

    const getIcon = () => {
        if (status === "valide") {
            return (
                <div className="w-[40px] h-[40px] rounded-full bg-[#25a04f]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={20} className="text-[#25a04f]" />
                </div>
            );
        }
        return (
            <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                status === "en_cours" ? "bg-[#e68b3c]" : "bg-bgGray text-colorMuted"
            }`}>
                {numero}
            </div>
        );
    };

    return (
        <div className="flex gap-4 pb-6 border-b border-colorBorder last:border-b-0 last:pb-0">
            {getIcon()}
            <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[16px] font-semibold text-colorTitle">{numero}. {titre}</h3>
                    {getStatusBadge()}
                </div>
                <p className="text-[14px] text-colorMuted mb-3 leading-relaxed">{description}</p>
                {date && (
                    <p className="text-[12px] text-colorMuted mb-3">Complété le {date}</p>
                )}
                {actions && actions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {actions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                                    action.variant === "primary"
                                        ? "bg-primaryColor hover:bg-primaryColor/90 text-white"
                                        : "bg-bgCard border border-colorBorder hover:bg-bgGray text-colorTitle"
                                }`}
                            >
                                {action.variant === "primary" && <Video size={14} />}
                                <span>{action.label}</span>
                                {action.variant !== "primary" && <ArrowRight size={14} />}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const EtapesParcours = () => {
    const etapes: EtapeProps[] = [
        {
            numero: 1,
            titre: "Définition de l'idée",
            status: "valide",
            description: "Tu as présenté ton idée de business en détail via le formulaire guidé.",
            date: "28 Janvier 2026",
            actions: [
                { label: "Revoir mes réponses", href: "/membre/business-alignes/formulaire" },
            ],
        },
        {
            numero: 2,
            titre: "Analyse de cohérence",
            status: "valide",
            description: "Notre équipe a analysé ton projet et sa cohérence avec ta vie personnelle et professionnelle.",
            date: "5 Février 2026",
            actions: [
                { label: "Voir le rapport", href: "/membre/business-alignes/rapport" },
            ],
        },
        {
            numero: 3,
            titre: "Session de feedback",
            status: "en_cours",
            description: "Un échange en visio pour discuter de l'analyse avec Maurelle. Prépare tes questions!",
            date: "Prévu le 16 Février 2026 - 14:00 (Zoom)",
            actions: [
                { label: "Rejoindre la session", href: "/membre/business-alignes/session", variant: "primary" },
                { label: "Reporter le RDV", href: "/membre/business-alignes/reporter" },
            ],
        },
        {
            numero: 4,
            titre: "Plan d'action",
            status: "a_venir",
            description: "Tu recevras ta restitution finale avec les prochaines étapes recommandées pour ton projet.",
        },
    ];

    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow">
            <div className="mb-6">
                <h2 className="text-[20px] font-semibold text-colorTitle mb-2">
                    Étapes du parcours
                </h2>
                <p className="text-[14px] text-colorMuted">
                    Suis ta progression étape par étape
                </p>
            </div>
            <div className="flex flex-col">
                {etapes.map((etape) => (
                    <Etape key={etape.numero} {...etape} />
                ))}
            </div>
        </div>
    );
};

export default EtapesParcours;
