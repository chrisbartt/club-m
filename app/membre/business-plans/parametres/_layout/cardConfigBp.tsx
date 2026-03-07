"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CardConfigBp = () => {
    const [tarif, setTarif] = useState("450 USD");
    const [delai, setDelai] = useState("2-4 semaines");
    const [emailSupport, setEmailSupport] = useState("support@clubm.cd");

    const handleSave = () => {
        // Enregistrer les modifications
    };

    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden ">
            {/* Header */}
            <div className="flex items-center gap-2 py-5 px-6 border-b border-colorBorder">
                <h3 className="text-[16px] font-semibold text-colorTitle">Configuration générale</h3>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-6 py-6 px-6">
                <div className="flex flex-col gap-2">
                    <label htmlFor="tarif" className="text-[14px] font-semibold text-colorTitle">
                        Tarif Business Plan
                    </label>
                    <Input
                        id="tarif"
                        type="text"
                        value={tarif}
                        onChange={(e) => setTarif(e.target.value)}
                        className="h-11 bg-white border-colorBorder text-[14px] text-colorTitle dark:bg-transparent dark:border-colorBorder placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="delai" className="text-[14px] font-semibold text-colorTitle">
                        Délai moyen estimé
                    </label>
                    <Input
                        id="delai"
                        type="text"
                        value={delai}
                        onChange={(e) => setDelai(e.target.value)}
                        className="h-11 bg-white border-colorBorder text-[14px] text-colorTitle dark:bg-transparent dark:border-colorBorder placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-[14px] font-semibold text-colorTitle">
                        Email support
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={emailSupport}
                        onChange={(e) => setEmailSupport(e.target.value)}
                        className="h-11 bg-white border-colorBorder text-[14px] text-colorTitle dark:bg-transparent dark:border-colorBorder placeholder:text-colorMuted shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        className="h-11 px-8 bg-primaryColor text-white hover:bg-primaryColor/90 font-semibold shadow-none"
                    >
                        Enregistrer les modifications
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CardConfigBp;
