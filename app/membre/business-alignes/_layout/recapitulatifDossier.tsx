"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

const RecapitulatifDossier = () => {
    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-[20px] font-semibold text-colorTitle mb-2">
                        Récapitulatif de ton dossier
                    </h2>
                    <p className="text-[14px] text-colorMuted">
                        Les informations que tu as soumises
                    </p>
                </div>
                <Link
                    href="/membre/business-alignes/modifier"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-bgCard border border-colorBorder hover:bg-bgGray text-colorTitle font-medium rounded-lg transition-colors text-[13px]"
                >
                    <Pencil size={16} />
                    Modifier
                </Link>
            </div>

            <div className="space-y-6">
                {/* Informations Personnelles */}
                <div>
                    <h3 className="text-[14px] font-semibold text-colorTitle mb-3 uppercase tracking-wider">
                        Informations Personnelles
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-colorBorder">
                            <span className="text-[13px] text-colorMuted">Nom</span>
                            <span className="text-[13px] font-medium text-colorTitle">Marie Kabila</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-colorBorder">
                            <span className="text-[13px] text-colorMuted">Email</span>
                            <span className="text-[13px] font-medium text-colorTitle">marie@exemple.com</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-[13px] text-colorMuted">Téléphone</span>
                            <span className="text-[13px] font-medium text-colorTitle">+243 XXX XXX XXX</span>
                        </div>
                    </div>
                </div>

                {/* Profil & Situation */}
                <div>
                    <h3 className="text-[14px] font-semibold text-colorTitle mb-3 uppercase tracking-wider">
                        Profil & Situation
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-colorBorder">
                            <span className="text-[13px] text-colorMuted">Situation</span>
                            <span className="text-[13px] font-medium text-colorTitle">Salariée</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-colorBorder">
                            <span className="text-[13px] text-colorMuted">Disponibilité</span>
                            <span className="text-[13px] font-medium text-colorTitle">10-20h/semaine</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-[13px] text-colorMuted">Objectif</span>
                            <span className="text-[13px] font-medium text-colorTitle">Complément de revenus</span>
                        </div>
                    </div>
                </div>

                {/* Projet */}
                <div>
                    <h3 className="text-[14px] font-semibold text-colorTitle mb-3 uppercase tracking-wider">
                        Projet
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-colorBorder">
                            <span className="text-[13px] text-colorMuted">Nom</span>
                            <span className="text-[13px] font-medium text-colorTitle">BeautyBox</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-colorBorder">
                            <span className="text-[13px] text-colorMuted">Stade</span>
                            <span className="text-[13px] font-medium text-colorTitle">En réflexion</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-[13px] text-colorMuted">Paiement</span>
                            <span className="text-[13px] font-medium text-[#25a04f]">50 $ - Payé</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecapitulatifDossier;
