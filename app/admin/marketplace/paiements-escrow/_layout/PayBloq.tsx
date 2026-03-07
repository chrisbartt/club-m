"use client";

import { DollarSign } from "lucide-react";

// Types
interface PaiementBloque {
    id: string;
    commande: string;
    montant: string;
    libelle: string; // ex: "Litige en cours - Sophie M. vs Keza"
}

// Mock Data - Paiements bloqués (litiges)
const paiementsBloquesData: PaiementBloque[] = [
    {
        id: "1",
        commande: "CMD-0456",
        montant: "$200",
        libelle: "Litige en cours - Sophie M. vs Keza",
    },
    {
        id: "2",
        commande: "CMD-0449",
        montant: "$350",
        libelle: "Litige - Ruth L. vs Créa Studio",
    },
    {
        id: "3",
        commande: "CMD-0445",
        montant: "$300",
        libelle: "Litige - Grace K. vs Digital Boost",
    },
];

const PayBloq = () => {
    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 px-6 h-full">
            {/* Header */}
            <div className="flex items-center gap-2 pb-4 border-b border-colorBorder">
                <h3 className="text-[16px] font-semibold text-colorTitle">
                    Paiements bloqués
                </h3>
            </div>

            {/* Liste des paiements bloqués */}
            <div className="flex flex-col gap-3 pt-4">
                {paiementsBloquesData.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-[#dd3d3d]/5 "
                    >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#e68b3c]/20 text-[#e68b3c]">
                            <DollarSign size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-colorTitle">
                                {item.commande} • {item.montant}
                            </p>
                            <p className="text-[13px] text-colorMuted mt-0.5">
                                {item.libelle}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PayBloq;
