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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDialog } from "@/context/dialog-context";
import { Calendar, Plus, X } from "lucide-react";
import { useState } from "react";

const DIALOG_NAME = "addTontineDialog";

const ModalAddTontine = () => {
    const { isDialogOpen, closeDialog } = useDialog();
    const [nom, setNom] = useState("");
    const [codeInterne, setCodeInterne] = useState("");
    const [montantMensuel, setMontantMensuel] = useState("50");
    const [duree, setDuree] = useState("24");
    const [dateDebut, setDateDebut] = useState("");
    const [nombrePlaces, setNombrePlaces] = useState(24);
    const [description, setDescription] = useState("");
    const [notifMembres, setNotifMembres] = useState(true);
    const [preInscriptions, setPreInscriptions] = useState(false);
    const [tontinePremium, setTontinePremium] = useState(false);

    const handleCreate = () => {
        // TODO: soumission API
        closeDialog(DIALOG_NAME);
    };

    return (
        <Dialog
            open={isDialogOpen(DIALOG_NAME)}
            onOpenChange={() => closeDialog(DIALOG_NAME)}
        >
            <DialogContent
                className="sm:max-w-lg w-full border-0 bg-bgCard rounded-[24px] pt-0 gap-0 max-h-[calc(100%_-_8rem)] flex flex-col p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
                showCloseButton={false}
            >
                <DialogHeader className="relative flex-row items-center justify-between gap-0 py-4 px-6 border-b border-colorBorder">
                    <DialogTitle className="text-lg font-semibold text-colorTitle flex items-center gap-2">
                        
                        Créer une nouvelle Tontine
                    </DialogTitle>
                    <button
                        onClick={() => closeDialog(DIALOG_NAME)}
                        className="text-colorMuted hover:text-colorTitle transition-colors"
                    >
                        <X size={20} />
                    </button>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-5">
                    <div className="flex flex-col gap-4">
                        {/* Nom de la tontine * */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Nom de la tontine <span className="text-[#dc2626]">*</span>
                            </label>
                            <Input
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="Ex: Tontine Excellence"
                                className="h-11 text-[14px] border-colorBorder shadow-none focus-visible:ring-0"
                            />
                        </div>

                        {/* Code interne */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Code interne
                            </label>
                            <Input
                                value={codeInterne}
                                onChange={(e) => setCodeInterne(e.target.value)}
                                placeholder="Ex: TONT-2025-001"
                                className="h-11 text-[14px] border-colorBorder shadow-none focus-visible:ring-0"
                            />
                        </div>

                        {/* Montant mensuel * & Durée * */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-medium text-colorTitle">
                                    Montant mensuel <span className="text-[#dc2626]">*</span>
                                </label>
                                <Select value={montantMensuel} onValueChange={setMontantMensuel}>
                                    <SelectTrigger className="h-11 w-full text-[14px] border-colorBorder shadow-none focus:ring-0">
                                        <SelectValue placeholder="Montant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="50">50 USD</SelectItem>
                                        <SelectItem value="100">100 USD</SelectItem>
                                        <SelectItem value="150">150 USD</SelectItem>
                                        <SelectItem value="200">200 USD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] font-medium text-colorTitle">
                                    Durée <span className="text-[#dc2626]">*</span>
                                </label>
                                <Select value={duree} onValueChange={setDuree}>
                                    <SelectTrigger className="h-11 w-full text-[14px] border-colorBorder shadow-none focus:ring-0">
                                        <SelectValue placeholder="Durée" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="12">12 mois</SelectItem>
                                        <SelectItem value="24">24 mois</SelectItem>
                                        <SelectItem value="36">36 mois</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Date de début * */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Date de début <span className="text-[#dc2626]">*</span>
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={dateDebut}
                                    onChange={(e) => setDateDebut(e.target.value)}
                                    placeholder="jj / mm / aaaa"
                                    className="h-11 text-[14px] border-colorBorder shadow-none focus-visible:ring-0 pr-10"
                                />
                                <Calendar
                                    size={18}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-colorMuted pointer-events-none"
                                />
                            </div>
                        </div>

                        {/* Nombre de places * */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Nombre de places <span className="text-[#dc2626]">*</span>
                            </label>
                            <Input
                                type="number"
                                min={1}
                                max={100}
                                value={nombrePlaces}
                                onChange={(e) => setNombrePlaces(Number(e.target.value) || 0)}
                                className="h-11 text-[14px] border-colorBorder shadow-none focus-visible:ring-0"
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Description
                            </label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description de la tontine, conditions particulières..."
                                className="min-h-[100px] text-[14px] border-colorBorder shadow-none focus-visible:ring-0 resize-y"
                            />
                        </div>

                        {/* Options */}
                        <div className="flex flex-col gap-3 pt-2">
                            <p className="text-[13px] font-medium text-colorTitle">Options</p>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="notif-membres"
                                        checked={notifMembres}
                                        onCheckedChange={(c) => setNotifMembres(!!c)}
                                        className="border-colorBorder data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor"
                                    />
                                    <label
                                        htmlFor="notif-membres"
                                        className="text-[13px] text-colorTitle cursor-pointer"
                                    >
                                        Envoyer notification aux membres éligibles
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="pre-inscriptions"
                                        checked={preInscriptions}
                                        onCheckedChange={(c) => setPreInscriptions(!!c)}
                                        className="border-colorBorder data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor"
                                    />
                                    <label
                                        htmlFor="pre-inscriptions"
                                        className="text-[13px] text-colorTitle cursor-pointer"
                                    >
                                        Permettre les pré-inscriptions
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="tontine-premium"
                                        checked={tontinePremium}
                                        onCheckedChange={(c) => setTontinePremium(!!c)}
                                        className="border-colorBorder data-[state=checked]:bg-primaryColor data-[state=checked]:border-primaryColor"
                                    />
                                    <label
                                        htmlFor="tontine-premium"
                                        className="text-[13px] text-colorTitle cursor-pointer"
                                    >
                                        Tontine premium (critères stricts)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 px-6 py-4 border-t border-colorBorder">
                    <Button
                        variant="outline"
                        onClick={() => closeDialog(DIALOG_NAME)}
                        className="h-10 px-5 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none flex-1"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleCreate}
                        className="h-10 px-5 bg-primaryColor text-white hover:bg-primaryColor/90 shadow-none flex-1"
                    >
                        Créer la tontine
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalAddTontine;
export { DIALOG_NAME as addTontineDialogName };
