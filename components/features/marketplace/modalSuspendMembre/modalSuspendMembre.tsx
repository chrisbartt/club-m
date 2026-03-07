"use client";

import { Button } from "@/components/ui/button";
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
import { useDialog } from "@/context/dialog/contextDialog";
import {  X } from "lucide-react";
import { useState } from "react";

const ModalSuspendMembre = () => {
    const { isDialogOpen, closeDialog } = useDialog();
    const [motif, setMotif] = useState("litiges_repetes");
    const [duree, setDuree] = useState("7_jours");
    const [message, setMessage] = useState("");

    const handleConfirmer = () => {
        // Confirmer la suspension logic here
        closeDialog("suspendMembreDialog");
    };

    return (
        <Dialog
            open={isDialogOpen("suspendMembreDialog")}
            onOpenChange={() => closeDialog("suspendMembreDialog")}
        >
            <DialogContent
                className="sm:max-w-lg w-full border-0 bg-bgCard rounded-[24px] pt-0 gap-0 max-h-[calc(100%-8rem)] flex flex-col p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
                showCloseButton={false}
            >
                <DialogHeader className="relative flex-row items-center justify-between gap-0 py-4 px-6 border-b border-colorBorder">
                    <DialogTitle className="text-lg font-semibold text-colorTitle flex items-center gap-2">
                        Suspendre un membre
                    </DialogTitle>
                    <button
                        onClick={() => closeDialog("suspendMembreDialog")}
                        className="flex items-center justify-center w-9 h-9 rounded-full bg-bgGray/80 text-colorMuted hover:text-colorTitle hover:bg-bgGray transition-colors cursor-pointer"
                        aria-label="Fermer"
                    >
                        <X size={18} />
                    </button>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-5 relative z-10">
                    <div className="flex flex-col gap-5">
                        {/* Motif de suspension */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Motif de suspension
                            </label>
                            <Select value={motif} onValueChange={setMotif}>
                                <SelectTrigger className="!h-[42px] text-[14px] border-colorBorder shadow-none focus:ring-0 w-full rounded-lg">
                                    <SelectValue placeholder="Sélectionner un motif" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="litiges_repetes">
                                        Litiges répétés
                                    </SelectItem>
                                    <SelectItem value="non_conformite">
                                        Non-conformité des services
                                    </SelectItem>
                                    <SelectItem value="retard_paiement">
                                        Retard de paiement
                                    </SelectItem>
                                    <SelectItem value="comportement">
                                        Comportement inapproprié
                                    </SelectItem>
                                    <SelectItem value="autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Durée */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Durée
                            </label>
                            <Select value={duree} onValueChange={setDuree}>
                                <SelectTrigger className="!h-[42px] text-[14px] border-colorBorder shadow-none focus:ring-0 w-full rounded-lg">
                                    <SelectValue placeholder="Sélectionner une durée" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7_jours">7 jours</SelectItem>
                                    <SelectItem value="14_jours">14 jours</SelectItem>
                                    <SelectItem value="30_jours">30 jours</SelectItem>
                                    <SelectItem value="90_jours">90 jours</SelectItem>
                                    <SelectItem value="indefini">Indéfini</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Message au membre */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Message au membre
                            </label>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Expliquez la raison de la suspension..."
                                className="min-h-[100px] text-[14px] border-colorBorder shadow-none focus-visible:ring-0 resize-y rounded-lg resize-none"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-3 px-6 py-4 border-t border-colorBorder">
                    <Button
                        variant="outline"
                        onClick={() => closeDialog("suspendMembreDialog")}
                        className="h-10 px-5 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none cursor-pointer flex-1 rounded-lg"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleConfirmer}
                        className="h-10 px-5 bg-[#dd3d3d] text-white hover:bg-[#dd3d3d]/90 shadow-none cursor-pointer flex-1 rounded-lg"
                    >
                        Confirmer la suspension
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalSuspendMembre;
