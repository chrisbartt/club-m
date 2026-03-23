"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDialog } from "@/context/dialog-context";
import { Send, X } from "lucide-react";
import { useState } from "react";

const DIALOG_NAME = "modalRappelPayDialog";

interface MembreCible {
    id: string;
    nom: string;
    retardJours: number;
}

const membresCiblesInit: MembreCible[] = [
    { id: "1", nom: "Flora Tshimanga", retardJours: 15 },
    { id: "2", nom: "Diane Mbuyi", retardJours: 10 },
    { id: "3", nom: "Sophie Kabila", retardJours: 8 },
];

const ModalRappelPay = () => {
    const { isDialogOpen, closeDialog } = useDialog();
    const [tontine, setTontine] = useState("business_ladies");
    const [membres, setMembres] = useState<Record<string, boolean>>({
        "1": true,
        "2": true,
        "3": true,
    });
    const [tonMessage, setTonMessage] = useState("rappel_amical");
    const [messagePerso, setMessagePerso] = useState("");

    const handleToggleMembre = (id: string, checked: boolean) => {
        setMembres((prev) => ({ ...prev, [id]: checked }));
    };

    const handleSend = () => {
        // TODO: soumission API
        closeDialog(DIALOG_NAME);
    };

    return (
        <Dialog
            open={isDialogOpen(DIALOG_NAME)}
            onOpenChange={() => closeDialog(DIALOG_NAME)}
        >
            <DialogContent
                className="sm:max-w-lg w-full border-0 bg-bgCard rounded-[24px] pt-0 gap-0 max-h-[calc(100%-8rem)] flex flex-col p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
                showCloseButton={false}
            >
                <DialogHeader className="relative flex-row items-center justify-between gap-0 py-4 px-6 border-b border-colorBorder">
                    <DialogTitle className="text-lg font-semibold text-colorTitle flex items-center gap-2">
                        Envoyer un rappel de paiement
                    </DialogTitle>
                    <button
                        onClick={() => closeDialog(DIALOG_NAME)}
                        className="text-colorMuted hover:text-colorTitle transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-5">
                    <div className="flex flex-col gap-5">
                        {/* Tontine */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Tontine
                            </label>
                            <Select value={tontine} onValueChange={setTontine}>
                                <SelectTrigger className="h-11 text-[14px] border-colorBorder shadow-none focus:ring-0 w-full">
                                    <SelectValue placeholder="Choisir une tontine" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="business_ladies">
                                        Tontine Business Ladies (6 en retard)
                                    </SelectItem>
                                    <SelectItem value="entraide">Tontine Entraide</SelectItem>
                                    <SelectItem value="solidarite">Tontine Solidarité</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Membres ciblés */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Membres ciblés
                            </label>
                            <div className="flex flex-col gap-3">
                                {membresCiblesInit.map((m) => (
                                    <div key={m.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={`membre-${m.id}`}
                                            checked={membres[m.id] ?? true}
                                            onCheckedChange={(c) => handleToggleMembre(m.id, !!c)}
                                            className="border-colorBorder data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor"
                                        />
                                        <label
                                            htmlFor={`membre-${m.id}`}
                                            className="text-[13px] text-colorTitle cursor-pointer"
                                        >
                                            {m.nom} - Retard {m.retardJours} jours
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ton du message */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Ton du message
                            </label>
                            <Select value={tonMessage} onValueChange={setTonMessage}>
                                <SelectTrigger className="h-11 text-[14px] border-colorBorder shadow-none focus:ring-0 w-full">
                                    <SelectValue placeholder="Choisir le ton" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rappel_amical">Rappel amical</SelectItem>
                                    <SelectItem value="formel">Formel</SelectItem>
                                    <SelectItem value="ferme">Ferme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Message personnalisé */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Message personnalisé
                            </label>
                            <Textarea
                                value={messagePerso}
                                onChange={(e) => setMessagePerso(e.target.value)}
                                placeholder="Message optionnel..."
                                className="min-h-[100px] text-[14px] border-colorBorder shadow-none focus-visible:ring-0 resize-y"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 px-6 py-4 border-t border-colorBorder">
                    <Button
                        variant="outline"
                        onClick={() => closeDialog(DIALOG_NAME)}
                        className="h-10 px-5 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none flex-1 cursor-pointer"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSend}
                        className="h-10 px-5 bg-primaryColor text-white hover:bg-primaryColor/90 shadow-none flex-1 gap-2 cursor-pointer"
                    >
                        <Send size={16} />
                        Envoyer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalRappelPay;
export { DIALOG_NAME as modalRappelPayDialogName };
