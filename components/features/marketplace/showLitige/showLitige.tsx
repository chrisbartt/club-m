"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useDrawer } from "@/context/drawer-context";
import {
    AlertTriangle,
    Ban,
    Check,
    FileText,
    MessageCircle,
    Package,
    Paperclip,
    Pencil,
    Scale,
    Shield,
    StickyNote,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";

// Types pour motif et priorité (alignés avec tableLitigeEncours)
type MotifLitige = "non_conformite" | "retard_livraison" | "communication";
type PrioriteLitige = "urgent" | "moyen" | "normal";

// Données passées depuis les tableaux (litige en cours ou résolu)
export type LitigeDrawerData = {
    id: string;
    numeroLitige: string;
    client: string;
    prestatatoire: string;
    resolution?: "remboursement_partiel" | "livraison_validee";
    date?: string;
    montantBloque?: string;
    // En cours
    commande?: string;
    motif?: MotifLitige;
    priorite?: PrioriteLitige;
    ouvertLe?: string;
    clientInitiales?: string;
    clientAvatarColor?: string;
    prestatatoireInitiales?: string;
    prestatatoireAvatarColor?: string;
    // Détails optionnels (mock ou API)
    service?: string;
    montantCommande?: string;
    dateCommande?: string;
    motifTexte?: string;
    motifAuteur?: string;
    motifDate?: string;
    reponseTexte?: string;
    reponseAuteur?: string;
    reponseDate?: string;
    piecesJointes?: { nom: string }[];
};

// Données mock quand non fournies
const defaultCommande = {
    numero: "CMD-0456",
    service: "Formation Leadership",
    montant: "$200",
    dateCommande: "5 Mars 2025",
};
const defaultMotif = {
    texte: "La formation reçue ne correspond pas à la description. Le contenu était incomplet et les supports promis n'ont pas été fournis.",
    auteur: "Sophie M.",
    date: "12 Mars 2025",
};
const defaultReponse = {
    texte: "Tous les éléments ont été fournis. La cliente n'a pas téléchargé les supports depuis l'espace dédié. Je peux renvoyer le lien.",
    auteur: "Keza Consulting",
    date: "13 Mars 2025",
};
const defaultPiecesJointes = [{ nom: "Livrable.pdf" }, { nom: "Échanges.pdf" }];

const motifLabels: Record<MotifLitige, string> = {
    non_conformite: "Non-conformité",
    retard_livraison: "Retard livraison",
    communication: "Communication",
};
const prioriteLabels: Record<PrioriteLitige, string> = {
    urgent: "Urgent",
    moyen: "Moyen",
    normal: "Normal",
};

const ShowLitige = () => {
    const { isDrawerOpen, closeDrawer, getDrawerData } = useDrawer();
    const [notes, setNotes] = useState("");
    const [verdict, setVerdict] = useState("");
    const [justification, setJustification] = useState("");
    const litigeData = getDrawerData("ShowLitige") as LitigeDrawerData | undefined;
    const isResolu = !!litigeData?.resolution;

    const commande = {
        numero: litigeData?.commande ?? defaultCommande.numero,
        service: litigeData?.service ?? defaultCommande.service,
        montant: litigeData?.montantCommande ?? litigeData?.montantBloque ?? defaultCommande.montant,
        dateCommande: litigeData?.dateCommande ?? defaultCommande.dateCommande,
    };
    const motif = {
        texte: litigeData?.motifTexte ?? defaultMotif.texte,
        auteur: litigeData?.motifAuteur ?? litigeData?.client ?? defaultMotif.auteur,
        date: litigeData?.motifDate ?? defaultMotif.date,
    };
    const reponse = {
        texte: litigeData?.reponseTexte ?? defaultReponse.texte,
        auteur: litigeData?.reponseAuteur ?? litigeData?.prestatatoire ?? defaultReponse.auteur,
        date: litigeData?.reponseDate ?? defaultReponse.date,
    };
    const piecesJointes = litigeData?.piecesJointes?.length
        ? litigeData.piecesJointes
        : defaultPiecesJointes;

    const handleSauvegarderNotes = () => {
        // Persister les notes côté admin
    };
    const handleValiderDecision = () => {
        // Soumettre verdict + justification
    };
    const handleDemanderPlusInfos = () => {
        // Action demander plus d'infos
    };

    const titre = litigeData?.numeroLitige
        ? `Litige ${litigeData.numeroLitige}`
        : "Détail litige";

    return (
        <Sheet
            open={isDrawerOpen("ShowLitige")}
            onOpenChange={() => closeDrawer("ShowLitige")}
        >
            <SheetContent className="border-0 bg-bgCard w-[640px] max-w-[100%!important] sm:max-w-[100%!important] [&>button]:hidden p-0 flex flex-col">
                {/* Header */}
                <SheetHeader className="px-6 py-4 border-b border-colorBorder">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-[18px] font-semibold text-colorTitle flex items-center gap-2">
                            {litigeData ? (
                                isResolu ? (
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#25a04f]/10 text-[#25a04f]">
                                        <Check size={18} />
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#e68b3c]/10 text-[#e68b3c]">
                                        <AlertTriangle size={18} />
                                    </span>
                                )
                            ) : null}
                            {titre}
                        </SheetTitle>
                        <Button
                            onClick={() => closeDrawer("ShowLitige")}
                            className="p-2 h-auto cursor-pointer rounded-full bg-bgGray/80 hover:bg-bgGray hover:text-colorTitle transition-colors group shadow-none"
                            aria-label="Fermer"
                        >
                            <X className="h-5 w-5 text-colorMuted group-hover:text-colorTitle" />
                        </Button>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Bloc statut : en cours (rouge pâle) ou résolu (vert) */}
                    {litigeData ? (
                        <div
                            className={`p-5 rounded-xl mb-5 ${isResolu
                                ? "bg-[#25a04f]/10"
                                : "bg-[#dd3d3d]/10"
                                }`}
                        >
                            <div className="flex flex-col gap-3">
                                {isResolu ? (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#25a04f]/20 text-[#25a04f]">
                                                <span className="w-2 h-2 rounded-full bg-[#25a04f]" />
                                                {litigeData.resolution === "remboursement_partiel"
                                                    ? "Remboursement partiel"
                                                    : "Livraison validée"}
                                            </span>
                                        </div>
                                        {litigeData.date && (
                                            <p className="text-[13px] text-colorMuted">
                                                Résolu le {litigeData.date}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#dd3d3d]/20 text-[#dd3d3d]">
                                                <span className="w-2 h-2 rounded-full bg-[#dd3d3d]" />
                                                {litigeData.priorite && litigeData.motif
                                                    ? `${prioriteLabels[litigeData.priorite]} - ${motifLabels[litigeData.motif]}`
                                                    : "En cours"}
                                            </span>
                                            {litigeData.ouvertLe && (
                                                <span className="text-[12px] text-colorMuted">
                                                    Ouvert le {litigeData.ouvertLe}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[24px] font-bold text-[#dd3d3d]">
                                            {litigeData.montantBloque ?? commande.montant} bloqués
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-5 bg-[#3a86ff]/10 rounded-xl mb-5">
                            <div className="flex flex-col items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#3a86ff]/20 text-[#3a86ff]">
                                    <span className="w-2 h-2 rounded-full bg-[#3a86ff]" />
                                    En cours
                                </span>
                                <p className="text-[24px] font-bold text-colorTitle">
                                    $150 bloqués
                                </p>
                            </div>
                        </div>
                    )}

                    {/* PARTIES EN CONFLIT */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Users size={14} className="text-[#3a86ff]" />
                            Parties en conflit
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-bgGray/50 rounded-xl border-2 border-[#3a86ff]/30">
                                <p className="text-[10px] font-medium text-colorMuted uppercase tracking-wider mb-2">
                                    Plaignant
                                </p>
                                <div className="flex items-center gap-3">
                                    {litigeData?.clientInitiales && litigeData?.clientAvatarColor ? (
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-semibold shrink-0 ${litigeData.clientAvatarColor}`}
                                        >
                                            {litigeData.clientInitiales}
                                        </div>
                                    ) : null}
                                    <p className="text-[14px] font-semibold text-colorTitle">
                                        {litigeData?.client ?? "Client"}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-bgGray/50 rounded-xl border-2 border-colorBorder/50">
                                <p className="text-[10px] font-medium text-colorMuted uppercase tracking-wider mb-2">
                                    Défendeur
                                </p>
                                <div className="flex items-center gap-3">
                                    {litigeData?.prestatatoireInitiales && litigeData?.prestatatoireAvatarColor ? (
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-semibold shrink-0 ${litigeData.prestatatoireAvatarColor}`}
                                        >
                                            {litigeData.prestatatoireInitiales}
                                        </div>
                                    ) : null}
                                    <p className="text-[14px] font-semibold text-colorTitle">
                                        {litigeData?.prestatatoire ?? "Prestataire"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COMMANDE CONCERNÉE */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Package size={14} />
                            Commande concernée
                        </h4>
                        <div className="p-4 bg-bgGray/50 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-colorMuted">N° Commande</span>
                                <span className="text-[14px] font-semibold text-colorTitle">
                                    {commande.numero}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-colorMuted">Service</span>
                                <span className="text-[14px] font-semibold text-colorTitle">
                                    {commande.service}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-colorMuted">Montant</span>
                                <span className="text-[14px] font-semibold text-colorTitle">
                                    {commande.montant}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[12px] text-colorMuted">Date commande</span>
                                <span className="text-[14px] font-semibold text-colorTitle">
                                    {commande.dateCommande}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* MOTIF DU LITIGE */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Pencil size={14} />
                            Motif du litige
                        </h4>
                        <div className="pl-4 border-l-4 border-[#dd3d3d] py-2">
                            <p className="text-[14px] text-colorTitle mb-2">{motif.texte}</p>
                            <p className="text-[12px] text-colorMuted">
                                — {motif.auteur}, {motif.date}
                            </p>
                        </div>
                    </div>

                    {/* RÉPONSE DU PRESTATAIRE */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <MessageCircle size={14} />
                            Réponse du prestataire
                        </h4>
                        <div className="pl-4 border-l-4 border-[#e68b3c] py-2">
                            <p className="text-[14px] text-colorTitle mb-2">{reponse.texte}</p>
                            <p className="text-[12px] text-colorMuted">
                                — {reponse.auteur}, {reponse.date}
                            </p>
                        </div>
                    </div>

                    {/* PIÈCES JOINTES */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Paperclip size={14} />
                            Pièces jointes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {piecesJointes.map((f, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-bgGray/80 text-[13px] text-colorTitle border border-colorBorder/50"
                                >
                                    <FileText size={16} className="text-colorMuted shrink-0" />
                                    {f.nom}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* DÉCISION D'ARBITRAGE — uniquement pour litiges en cours */}
                    {!isResolu && (
                        <div className="mb-5">
                            <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Scale size={14} />
                                {"Décision d\u2019arbitrage"}
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[12px] font-medium text-colorTitle block mb-1.5">
                                        Verdict
                                    </label>
                                    <Select value={verdict} onValueChange={setVerdict}>
                                        <SelectTrigger className="h-10 text-[13px] border-colorBorder shadow-none focus:ring-0 bg-white">
                                            <SelectValue placeholder="Sélectionner une décision..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="remboursement_partiel">
                                                Remboursement partiel
                                            </SelectItem>
                                            <SelectItem value="livraison_validee">
                                                Livraison validée
                                            </SelectItem>
                                            <SelectItem value="rejet">Rejet du litige</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-[12px] font-medium text-colorTitle block mb-1.5">
                                        Justification (visible par les deux parties)
                                    </label>
                                    <Textarea
                                        value={justification}
                                        onChange={(e) => setJustification(e.target.value)}
                                        placeholder="Expliquez votre décision..."
                                        className="min-h-[100px] text-[14px] border-colorBorder shadow-none focus-visible:ring-0 resize-y"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 h-10 bg-[#25a04f] text-white hover:bg-[#25a04f]/90 gap-2 shadow-none cursor-pointer"
                                        onClick={handleValiderDecision}
                                    >
                                        <Check size={18} />
                                        Valider la décision
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-10 border-colorBorder text-colorTitle hover:bg-bgGray gap-2 shadow-none cursor-pointer"
                                        onClick={handleDemanderPlusInfos}
                                    >
                                        {"Demander plus d\u2019infos"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ACTIONS COMPLÉMENTAIRES — affichées pour tous (ou uniquement en cours selon maquette) */}
                    <div className="mb-5">
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Shield size={14} />
                            Actions complémentaires
                        </h4>
                        <div className="flex flex-col gap-2">
                            <Button
                                variant="outline"
                                className="w-full h-11 justify-start gap-2 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none cursor-pointer"
                            >
                                <AlertTriangle size={18} className="text-[#e68b3c]" />
                                Avertir le prestataire
                            </Button>
                            <Button
                                className="w-full h-11 justify-start gap-2 bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 shadow-none cursor-pointer"
                            >
                                <Ban size={18} />
                                Suspendre le prestataire
                            </Button>
                        </div>
                    </div>

                    {/* NOTES INTERNES */}
                    <div>
                        <h4 className="text-[11px] font-semibold text-colorMuted uppercase tracking-wider mb-3 flex items-center gap-2">
                            <StickyNote size={14} />
                            Notes internes
                        </h4>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ajouter une note interne (non visible)..."
                            className="min-h-[120px] text-[14px] border-colorBorder shadow-none focus-visible:ring-0 resize-y mb-3"
                        />
                        <Button
                            variant="outline"
                            onClick={handleSauvegarderNotes}
                            className="w-full h-10 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none cursor-pointer"
                        >
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ShowLitige;
