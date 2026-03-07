"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertTriangle,
    Check,
    Clock,
    FileText,
    Package,
} from "lucide-react";

// Types
type CategorieAlerte =
    | "litiges"
    | "livraisons"
    | "expirations"
    | "nouvelles_commandes"
    | "commande_validee";

type TypeAlerte =
    | "litige"
    | "livraison"
    | "expiration"
    | "nouvelle_commande"
    | "commande_validee";

interface Alerte {
    id: string;
    type: TypeAlerte;
    categorie: CategorieAlerte;
    titre: string;
    description: string;
    timestamp: string;
    actionLabel: string;
    actionVariant: "red" | "orange" | "outline";
}

// Mock Data - Alertes / notifications (maquette)
const mockAlertes: Alerte[] = [
    {
        id: "1",
        type: "litige",
        categorie: "litiges",
        titre: "Litige ouvert - Client insatisfait",
        description:
            "CMD-2025-0456 • Sophie M. signale une non-conformité de la livraison",
        timestamp: "Il y a 2h",
        actionLabel: "Traiter",
        actionVariant: "red",
    },
    {
        id: "2",
        type: "litige",
        categorie: "litiges",
        titre: "Litige ouvert - Retard de livraison",
        description: "CMD-2025-0449 • Délai dépassé de 5 jours",
        timestamp: "Il y a 1 jour",
        actionLabel: "Traiter",
        actionVariant: "red",
    },
    {
        id: "2b",
        type: "litige",
        categorie: "litiges",
        titre: "Litige ouvert - Communication",
        description: "CMD-2025-0442 • Problème de communication signalé",
        timestamp: "Il y a 3h",
        actionLabel: "Traiter",
        actionVariant: "red",
    },
    {
        id: "3",
        type: "expiration",
        categorie: "expirations",
        titre: "Délai 48h expiré - Validation automatique",
        description:
            "CMD-2025-0461 • Le client n'a pas répondu, validation programmée dans 2h",
        timestamp: "Il y a 30 min",
        actionLabel: "Voir",
        actionVariant: "orange",
    },
    {
        id: "4",
        type: "livraison",
        categorie: "livraisons",
        titre: "Livraison effectuée",
        description:
            'CMD-2025-0463 • Digital Boost a livré "Stratégie Marketing"',
        timestamp: "Il y a 1h",
        actionLabel: "Voir",
        actionVariant: "outline",
    },
    {
        id: "5",
        type: "livraison",
        categorie: "livraisons",
        titre: "Livraison effectuée",
        description:
            'CMD-2025-0465 • Keza Consulting a livré "Business Plan"',
        timestamp: "Il y a 3h",
        actionLabel: "Voir",
        actionVariant: "outline",
    },
    {
        id: "6",
        type: "commande_validee",
        categorie: "commande_validee",
        titre: "Commande validée",
        description: "CMD-2025-0460 • Client satisfait, paiement libéré",
        timestamp: "Il y a 5h",
        actionLabel: "Voir",
        actionVariant: "outline",
    },
    {
        id: "7",
        type: "nouvelle_commande",
        categorie: "nouvelles_commandes",
        titre: "Nouvelle commande",
        description: "CMD-2025-0467 • Grace K. a commandé chez Keza Consulting",
        timestamp: "Il y a 6h",
        actionLabel: "Voir",
        actionVariant: "outline",
    },
];

// Config par type d'alerte : fond carte, icône, couleur icône
const configTypeAlerte: Record<
    TypeAlerte,
    { cardBg: string; iconBg: string; iconColor: string; Icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
    litige: {
        cardBg: "bg-[#dd3d3d]/5",
        iconBg: "bg-[#dd3d3d]/10",
        iconColor: "text-[#e68b3c]",
        Icon: AlertTriangle,
    },
    expiration: {
        cardBg: "bg-[#e68b3c]/5",
        iconBg: "bg-[#e68b3c]/10",
        iconColor: "text-[#dd3d3d]",
        Icon: Clock,
    },
    livraison: {
        cardBg: "bg-[#8c49b1]/10",
        iconBg: "bg-[#8c49b1]/10",
        iconColor: "text-[#8c49b1]",
        Icon: Package,
    },
    commande_validee: {
        cardBg: "bg-[#25a04f]/10",
        iconBg: "bg-[#25a04f]/10",
        iconColor: "text-[#25a04f]",
        Icon: Check,
    },
    nouvelle_commande: {
        cardBg: "bg-[#3a86ff]/10",
        iconBg: "bg-[#3a86ff]/10",
        iconColor: "text-[#3a86ff]",
        Icon: FileText,
    },
};

// Carte alerte
const AlerteCard = ({ alerte }: { alerte: Alerte }) => {
    const config = configTypeAlerte[alerte.type];
    const Icon = config.Icon;
    return (
        <div
            className={`flex flex-col gap-2 p-4 rounded-xl ${config.cardBg} transition-colors duration-200`}
        >
            <div className="flex items-center gap-4">
            <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg} ${config.iconColor}`}
            >
                <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-colorTitle">
                    {alerte.titre}
                </p>
                <p className="text-[13px] text-colorMuted mt-0.5">
                    {alerte.description}
                </p>
                <p className="text-[12px] text-colorMuted mt-1">
                    {alerte.timestamp}
                </p>
            </div>
            <Button
                size="sm"
                className={`shrink-0 h-9 px-4 hidden md:flex rounded-md shadow-none cursor-pointer text-[13px] ${alerte.actionVariant === "red"
                    ? "bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90"
                    : alerte.actionVariant === "orange"
                        ? "bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90"
                        : "bg-white border border-colorBorder text-colorTitle hover:bg-bgGray"
                    }`}
            >
                {alerte.actionLabel}
            </Button>
            </div>
            <Button
                size="sm"
                className={`shrink-0 h-9 px-4 flex md:hidden rounded-md shadow-none cursor-pointer text-[13px] ${alerte.actionVariant === "red"
                    ? "bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90"
                    : alerte.actionVariant === "orange"
                        ? "bg-[#e68b3c] text-white hover:bg-[#e68b3c]/90"
                        : "bg-white border border-colorBorder text-colorTitle hover:bg-bgGray"
                    }`}
            >
                {alerte.actionLabel}
            </Button>
        </div>
    );
};

// Comptes par catégorie pour les onglets
const getCountByCategorie = (categorie: string) => {
    if (categorie === "toutes") return mockAlertes.length;
    if (categorie === "litiges")
        return mockAlertes.filter((a) => a.categorie === "litiges").length;
    if (categorie === "livraisons")
        return mockAlertes.filter((a) => a.categorie === "livraisons").length;
    if (categorie === "expirations")
        return mockAlertes.filter((a) => a.categorie === "expirations").length;
    if (categorie === "nouvelles_commandes")
        return mockAlertes.filter(
            (a) => a.categorie === "nouvelles_commandes"
        ).length;
    return 0;
};

const TabsAlertes = () => {
    const getFilteredAlertes = (tabValue: string) => {
        if (tabValue === "toutes") return mockAlertes;
        if (tabValue === "litiges")
            return mockAlertes.filter((a) => a.categorie === "litiges");
        if (tabValue === "livraisons")
            return mockAlertes.filter((a) => a.categorie === "livraisons");
        if (tabValue === "expirations")
            return mockAlertes.filter((a) => a.categorie === "expirations");
        if (tabValue === "nouvelles_commandes")
            return mockAlertes.filter(
                (a) => a.categorie === "nouvelles_commandes"
            );
        return mockAlertes;
    };

    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden md:p-6 p-5  h-full flex flex-col">
            <Tabs defaultValue="toutes" className="flex flex-col flex-1 min-h-0">
                <TabsList
                    variant="line"
                    className="w-full justify-start h-auto p-0 bg-transparent gap-0 border-b border-colorBorder rounded-none min-h-0 overflow-x-auto" style={{scrollbarWidth:"none"}}
                >
                    <TabsTrigger
                        value="toutes"
                        className="tabs-trigger-alertes rounded-none border-0 border-b-[3px] border-transparent data-[state=active]:border-colorTitle data-[state=active]:text-colorTitle px-4 py-3 text-[13px] font-medium text-colorMuted mb-[-3px] data-[state=active]:font-semibold after:hidden cursor-pointer"
                    >
                        Toutes ({getCountByCategorie("toutes")})
                    </TabsTrigger>
                    <TabsTrigger
                        value="litiges"
                        className="tabs-trigger-alertes rounded-none border-0 border-b-[3px] border-transparent data-[state=active]:border-colorTitle data-[state=active]:text-colorTitle px-4 py-3 text-[13px] font-medium text-colorMuted mb-[-3px] data-[state=active]:font-semibold after:hidden cursor-pointer"
                    >
                        Litiges ({getCountByCategorie("litiges")})
                    </TabsTrigger>
                    <TabsTrigger
                        value="livraisons"
                        className="tabs-trigger-alertes rounded-none border-0 border-b-[3px] border-transparent data-[state=active]:border-colorTitle data-[state=active]:text-colorTitle px-4 py-3 text-[13px] font-medium text-colorMuted mb-[-3px] data-[state=active]:font-semibold after:hidden cursor-pointer"
                    >
                        Livraisons ({getCountByCategorie("livraisons")})
                    </TabsTrigger>
                    <TabsTrigger
                        value="expirations"
                        className="tabs-trigger-alertes rounded-none border-0 border-b-[3px] border-transparent data-[state=active]:border-colorTitle data-[state=active]:text-colorTitle px-4 py-3 text-[13px] font-medium text-colorMuted mb-[-3px] data-[state=active]:font-semibold after:hidden cursor-pointer"
                    >
                        Expirations ({getCountByCategorie("expirations")})
                    </TabsTrigger>
                    <TabsTrigger
                        value="nouvelles_commandes"
                        className="tabs-trigger-alertes rounded-none border-0 border-b-[3px] border-transparent data-[state=active]:border-colorTitle data-[state=active]:text-colorTitle px-4 py-3 text-[13px] font-medium text-colorMuted mb-[-3px] data-[state=active]:font-semibold after:hidden cursor-pointer"
                    >
                        Nouvelles commandes (
                        {getCountByCategorie("nouvelles_commandes")})
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto pt-4 min-h-0">
                    {(["toutes", "litiges", "livraisons", "expirations", "nouvelles_commandes"] as const).map(
                        (tabValue) => (
                            <TabsContent
                                key={tabValue}
                                value={tabValue}
                                className="mt-0 flex flex-col gap-3"
                            >
                                {getFilteredAlertes(tabValue).length === 0 ? (
                                    <p className="text-[13px] text-colorMuted py-6">
                                        Aucune alerte dans cette catégorie.
                                    </p>
                                ) : (
                                    getFilteredAlertes(tabValue).map((alerte) => (
                                        <AlerteCard
                                            key={alerte.id}
                                            alerte={alerte}
                                        />
                                    ))
                                )}
                            </TabsContent>
                        )
                    )}
                </div>
            </Tabs>
        </div>
    );
};

export default TabsAlertes;
