"use client";

import { Lightbulb, CheckCircle2, Target } from "lucide-react";

interface BenefitProps {
    icon: React.ReactNode;
    titre: string;
    description: string;
}

const Benefit = ({ icon, titre, description }: BenefitProps) => {
    return (
        <div className="flex gap-4">
            <div className="w-[48px] h-[48px] rounded-xl bg-primaryColor/10 flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-[16px] font-semibold text-colorTitle mb-2">{titre}</h3>
                <p className="text-[14px] text-colorMuted leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

const VisionObjectifs = () => {
    const benefits = [
        {
            icon: <Lightbulb size={24} className="text-primaryColor" />,
            titre: "Une idée clarifiée",
            description: "Ton idée devient concrète, simple à expliquer et à comprendre par tous. Fini le flou, place à la clarté.",
        },
        {
            icon: <CheckCircle2 size={24} className="text-[#25a04f]" />,
            titre: "Un avis structuré et honnête",
            description: "Un retour bienveillant sur la cohérence de ton projet avec ta vie personnelle, professionnelle et tes ressources.",
        },
        {
            icon: <Target size={24} className="text-[#3b82f6]" />,
            titre: "La prochaine étape claire",
            description: "Savoir si tu dois ajuster, pivoter ou passer directement au Business Plan. Plus de doutes, que des décisions.",
        },
    ];

    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow">
            <div className="mb-6">
                <h2 className="text-[20px] font-semibold text-colorTitle mb-2">
                    Vision & Objectifs du parcours
                </h2>
                <p className="text-[14px] text-colorMuted">
                    Ce que le Business Aligné t'apporte
                </p>
            </div>
            <div className="flex flex-col gap-6">
                {benefits.map((benefit, index) => (
                    <Benefit key={index} {...benefit} />
                ))}
            </div>
        </div>
    );
};

export default VisionObjectifs;
