"use client";

import { Button } from "@/components/ui/button";
import { FileText, Landmark } from "lucide-react";

const CardUploadFile = () => {
    const handleGenererDossier = () => {
        // TODO: brancher l'action de génération de dossiers bancaires
    };

    return (
        <div className="bg-primaryColor/10 border-2 border-dashed border-primaryColor/50 rounded-xl  py-16 px-6 flex flex-col items-center justify-center text-center w-full">
            {/* Icône banque */}
            <div className="mb-6 flex justify-center">
                <Landmark size={56} className="text-colorTitle" strokeWidth={1.25} />
            </div>

            {/* Titre */}
            <h3 className="text-lg font-bold text-colorTitle mb-2">Intégration Rawbank</h3>

            {/* Description */}
            <p className="text-sm text-colorMuted mb-6 max-w-[320px]">
                Générez des dossiers bancaires pour vos membres éligibles.
            </p>

            {/* Bouton */}
            <Button
                onClick={handleGenererDossier}
                className="px-4 bg-primaryColor hover:bg-primaryColor/90 text-white font-medium rounded-lg gap-2 shadow-none cursor-pointer h-10"
            >
                <FileText size={18} />
                Générer Dossier
            </Button>
        </div>
    );
};

export default CardUploadFile;
