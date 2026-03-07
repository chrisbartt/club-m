"use client";

import { CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Commande {
    id: string;
    offre: string;
    client: string;
    date: string;
    montant: number;
    statut: "en_attente" | "confirmee" | "annulee" | "terminee";
}

const MesCommandes = () => {
    const commandes: Commande[] = [
        {
            id: "1",
            offre: "Coaching Business Personnalisé",
            client: "Sophie M.",
            date: "10 Fév 2026",
            montant: 150,
            statut: "confirmee",
        },
        {
            id: "2",
            offre: "Pack Design Logo",
            client: "Jean K.",
            date: "8 Fév 2026",
            montant: 300,
            statut: "en_attente",
        },
        {
            id: "3",
            offre: "Formation Marketing",
            client: "Marie L.",
            date: "5 Fév 2026",
            montant: 199,
            statut: "terminee",
        },
    ];

    const getStatutBadge = (statut: string) => {
        switch (statut) {
            case "confirmee":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
                        <CheckCircle2 size={12} />
                        Confirmée
                    </span>
                );
            case "en_attente":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#e68b3c]/10 text-[#e68b3c]">
                        <Clock size={12} />
                        En attente
                    </span>
                );
            case "annulee":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-red-100 text-red-600">
                        <XCircle size={12} />
                        Annulée
                    </span>
                );
            case "terminee":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
                        <CheckCircle2 size={12} />
                        Terminée
                    </span>
                );
        }
    };

    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3 md:mb-4">
                <div>
                    <h2 className="md:text-[20px] text-base font-semibold text-colorTitle">
                        Mes commandes récentes
                    </h2>
                    <p className="text-[14px] text-colorMuted">
                        Suivez l&apos;état de vos commandes
                    </p>
                </div>
                <Link
                    href="/membre/marketplace/commandes"
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-colorTitle hover:underline"
                >
                    Voir toutes
                    <ArrowRight size={16} />
                </Link>
            </div>

            {commandes.length === 0 ? (
                <div className="text-center py-12 text-colorMuted">
                    <p>Aucune commande pour le moment</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {commandes.map((commande) => (
                        <div
                            key={commande.id}
                            className="flex items-center justify-between p-4 border border-colorBorder rounded-xl hover:bg-bgGray transition-colors"
                        >
                            <div className="flex-1">
                                <h3 className="text-[14px] font-semibold text-colorTitle mb-1">
                                    {commande.offre}
                                </h3>
                                <div className="flex items-center gap-3 text-[12px] text-colorMuted">
                                    <span>{commande.client}</span>
                                    <span>•</span>
                                    <span>{commande.date}</span>
                                    <span>•</span>
                                    <span className="font-semibold text-colorTitle">{commande.montant} $</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatutBadge(commande.statut)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MesCommandes;
