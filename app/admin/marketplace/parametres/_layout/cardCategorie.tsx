"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

// Bleu, orange, vert, mauve (couleurs du thème)
const AVATAR_BG_PALETTE = [
    "bg-bgSidebar", // bleu
    "bg-primaryColor", // orange
    "bg-darkenGreen", // vert
    "bg-[#8c49b1]", // mauve
] as const;

interface Categorie {
    id: string;
    name: string;
    avatarBg?: string;
}

const CardCategorie = () => {
    const [categories, setCategories] = useState<Categorie[]>([
        { id: "1", name: "Conseil & Stratégie", avatarBg: AVATAR_BG_PALETTE[0] },
        { id: "2", name: "Formation", avatarBg: AVATAR_BG_PALETTE[1] },
        { id: "3", name: "Marketing", avatarBg: AVATAR_BG_PALETTE[2] },
        { id: "4", name: "Finance", avatarBg: AVATAR_BG_PALETTE[3] },
    ]);

    const handleEdit = (id: string) => {
        // TODO: ouvrir modal / drawer d'édition
        void id;
    };

    const handleAjouter = () => {
        // TODO: ouvrir modal / formulaire d'ajout
        setCategories((prev) => {
            const nextBg =
                AVATAR_BG_PALETTE[prev.length % AVATAR_BG_PALETTE.length];
            return [
                ...prev,
                {
                    id: String(Date.now()),
                    name: "Nouvelle catégorie",
                    avatarBg: nextBg,
                },
            ];
        });
    };

    return (
        <div className="w-full card cardShadow bg-bgCard rounded-xl overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 md:py-5 py-4 md:px-6 px-5 border-b border-colorBorder">
                <h3 className="text-[16px] font-semibold text-colorTitle">
                    Catégories de services
                </h3>
            </div>

            <div className="flex-1 flex flex-col gap-3 md:py-6 py-5 md:px-6 px-5">
                {/* Liste des catégories */}
                <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                        <div
                            key={cat.id}
                            className="flex items-center justify-between gap-4 py-3 px-4 rounded-lg bg-bgGray/50"
                        >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-semibold text-white ${cat.avatarBg ?? "bg-colorMuted"}`}
                                    aria-hidden
                                >
                                    {cat.name.charAt(0)}
                                </span>
                                <p className="text-[14px] font-medium text-colorTitle truncate">
                                    {cat.name}
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(cat.id)}
                                className="h-9 w-9 shrink-0 rounded-lg bg-bgGray border-colorBorder text-colorTitle hover:bg-bgGray hover:text-colorTitle/90 shadow-none cursor-pointer"
                                aria-label="Modifier la catégorie"
                            >
                                <Pencil size={16} />
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Bouton ajouter */}
                <div className="flex md:justify-end pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAjouter}
                        className="h-11 w-full md:auto px-6 bg-primaryColor  text-white hover:bg-primaryColor/90 hover:text-white rounded-lg font-medium shadow-none cursor-pointer gap-2"
                    >
                        <Plus size={18} />
                        Ajouter une catégorie
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CardCategorie;
