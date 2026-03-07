"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CardConfigGenerale = () => {
    const [tauxCommission, setTauxCommission] = useState("10");
    const [delaiValidationHeures, setDelaiValidationHeures] = useState("48");
    const [delaiToleranceJours, setDelaiToleranceJours] = useState("3");

    const handleSave = () => {
        // Enregistrer les modifications
    };

    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 py-5 px-6 border-b border-colorBorder">
                <h3 className="text-[16px] font-semibold text-colorTitle">
                    Paramètres généraux
                </h3>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-6 py-6 px-6">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="taux-commission"
                        className="text-[14px] font-semibold text-colorTitle"
                    >
                        Taux de commission (%)
                    </label>
                    <Input
                        id="taux-commission"
                        type="number"
                        min={0}
                        max={100}
                        value={tauxCommission}
                        onChange={(e) => setTauxCommission(e.target.value)}
                        className="h-10 bg-white border-colorBorder text-[14px] text-colorTitle placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="delai-validation"
                        className="text-[14px] font-semibold text-colorTitle"
                    >
                        Délai de validation client (heures)
                    </label>
                    <Input
                        id="delai-validation"
                        type="number"
                        min={0}
                        value={delaiValidationHeures}
                        onChange={(e) =>
                            setDelaiValidationHeures(e.target.value)
                        }
                        className="h-10 bg-white border-colorBorder text-[14px] text-colorTitle placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="delai-tolerance"
                        className="text-[14px] font-semibold text-colorTitle"
                    >
                        Délai de tolérance retard (jours)
                    </label>
                    <Input
                        id="delai-tolerance"
                        type="number"
                        min={0}
                        value={delaiToleranceJours}
                        onChange={(e) =>
                            setDelaiToleranceJours(e.target.value)
                        }
                        className="h-10 bg-white border-colorBorder text-[14px] text-colorTitle placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        className="h-11 px-8 bg-primaryColor rounded-lg text-white hover:bg-primaryColor/90 font-semibold shadow-none cursor-pointer gap-2"
                    >
                        
                        Enregistrer les modifications
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CardConfigGenerale;
