"use client";

import { Eye, Edit, MoreVertical, Package, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Offre {
    id: string;
    titre: string;
    categorie: string;
    prix: number;
    statut: "active" | "en_attente" | "desactive";
    vues: number;
    commandes: number;
    image?: string;
}

const MesOffres = () => {
    const offres: Offre[] = [
        {
            id: "1",
            titre: "Coaching Business Personnalisé",
            categorie: "Services",
            prix: 150,
            statut: "active",
            vues: 245,
            commandes: 8,
        },
        {
            id: "2",
            titre: "Pack Design Logo + Identité Visuelle",
            categorie: "Services",
            prix: 300,
            statut: "active",
            vues: 189,
            commandes: 3,
        },
        {
            id: "3",
            titre: "Formation Marketing Digital",
            categorie: "Formations",
            prix: 199,
            statut: "en_attente",
            vues: 0,
            commandes: 0,
        },
    ];

    const getStatutBadge = (statut: string) => {
        switch (statut) {
            case "active":
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
                        Active
                    </span>
                );
            case "en_attente":
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-[#e68b3c]/10 text-[#e68b3c]">
                        En attente
                    </span>
                );
            case "desactive":
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-bgGray text-colorMuted">
                        Désactivée
                    </span>
                );
        }
    };

    return (
        <div className="bg-bgCard rounded-xl p-5 lg:p-6 cardShadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <div>
                    <h2 className="md:text-[20px] text-base font-semibold text-colorTitle">
                        Mes offres
                    </h2>
                    <p className="text-[14px] text-colorMuted">
                        Gérez vos produits et services en vente
                    </p>
                </div>
                <Link href="/membre/marketplace/nouvelle-offre" className="hidden">
                    <Button className="bg-primaryColor hover:bg-primaryColor/90 text-white gap-2">
                        <Plus size={18} />
                        Ajouter une offre
                    </Button>
                </Link>
            </div>

            {offres.length === 0 ? (
                <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-colorMuted mb-4" />
                    <p className="text-colorMuted mb-4">Aucune offre pour le moment</p>
                    <Link href="/membre/marketplace/nouvelle-offre">
                        <Button className="bg-primaryColor hover:bg-primaryColor/90 text-white gap-2">
                            <Plus size={18} />
                            Créer ma première offre
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-3 md:space-y-4">
                    {offres.map((offre) => (
                        <div
                            key={offre.id}
                            className="flex items-center gap-4 p-4 border border-colorBorder rounded-xl hover:bg-bgGray transition-colors"
                        >
                            <div className="md:w-[60px] w-[40px] md:h-[60px] h-[40px] rounded-lg bg-bgGray flex items-center justify-center flex-shrink-0">
                                <Package size={24} className="text-colorMuted" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="md:text-[16px] text-[14px] font-semibold text-colorTitle mb-1">
                                            {offre.titre}
                                        </h3>
                                        <p className="md:text-[13px] text-[12px] text-colorMuted">{offre.categorie}</p>
                                    </div>
                                    {getStatutBadge(offre.statut)}
                                </div>
                                <div className="flex items-center md:gap-4 gap-2 text-[12px] text-colorMuted">
                                    <span>{offre.prix} $</span>
                                    <span>•</span>
                                    <span>{offre.vues} vues</span>
                                    <span>•</span>
                                    <span>{offre.commandes} commandes</span>
                                </div>
                            </div>
                            <div className="hidden">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/membre/marketplace/offres/${offre.id}`} className="flex items-center gap-2">
                                            <Eye size={16} />
                                            Voir
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/membre/marketplace/offres/${offre.id}/modifier`} className="flex items-center gap-2">
                                            <Edit size={16} />
                                            Modifier
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MesOffres;
