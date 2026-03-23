"use client";

import { Button } from "@/components/ui/button";
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
import { Calendar, X } from "lucide-react";
import { useState } from "react";

const ModalCoaching = () => {
    const { isDialogOpen, closeDialog } = useDialog();
    const [coach, setCoach] = useState("marie_diallo");
    const [coachingType, setCoachingType] = useState("revue_bp");
    const [date, setDate] = useState("2026-02-03");
    const [heure, setHeure] = useState("14:00");
    const [note, setNote] = useState(
        "Membre inactive 21j. BP à 65%. À motiver sur les projections financières."
    );

    const handlePlanifier = () => {
        // Planifier coaching logic here
        closeDialog("coachingDialog");
    };

    return (
        <Dialog
            open={isDialogOpen("coachingDialog")}
            onOpenChange={() => closeDialog("coachingDialog")}
        >
            <DialogContent
                className="sm:max-w-lg w-full border-0 bg-bgCard rounded-[24px] pt-0 gap-0 max-h-[calc(100%_-_8rem)] flex flex-col p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
                showCloseButton={false}
            >
                <DialogHeader className="relative flex-row items-center justify-between gap-0 py-4 px-6 border-b border-colorBorder">
                    <DialogTitle className="text-lg font-semibold text-colorTitle">
                        Planifier coaching
                    </DialogTitle>
                    <button
                        onClick={() => closeDialog("coachingDialog")}
                        className="text-colorMuted hover:text-colorTitle transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </DialogHeader>

                <div className="overflow-y-auto overflow-hidden flex-1 px-6 py-5 relative z-10">
                    <div className="flex flex-col gap-5">
                        {/* Coach */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Coach
                            </label>
                            <Select value={coach} onValueChange={setCoach}>
                                <SelectTrigger className="!h-11 text-[14px] border-colorBorder dark:bg-transparent shadow-none focus:ring-0 w-full">
                                    <SelectValue placeholder="Sélectionner un coach" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-bgGray">
                                    <SelectItem value="marie_diallo">Marie Diallo</SelectItem>
                                    <SelectItem value="jean_mutombo">Jean Mutombo</SelectItem>
                                    <SelectItem value="grace_mbeki">Grace Mbeki</SelectItem>
                                    <SelectItem value="paul_kabila">Paul Kabila</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Type */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Type
                            </label>
                            <Select value={coachingType} onValueChange={setCoachingType}>
                                <SelectTrigger className="!h-11 text-[14px] border-colorBorder dark:bg-transparent shadow-none focus:ring-0 w-full">
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-bgGray">
                                    <SelectItem value="revue_bp">📋 Revue BP</SelectItem>
                                    <SelectItem value="strategie">🎯 Stratégie</SelectItem>
                                    <SelectItem value="marketing">📢 Marketing</SelectItem>
                                    <SelectItem value="finance">💰 Finance</SelectItem>
                                    <SelectItem value="autre">📝 Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Date
                            </label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-11 text-[14px] border-colorBorder dark:bg-transparent shadow-none focus-visible:ring-0"
                            />
                        </div>

                        {/* Heure */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Heure
                            </label>
                            <Select value={heure} onValueChange={setHeure}>
                                <SelectTrigger className="!h-11 text-[14px] border-colorBorder dark:bg-transparent shadow-none focus:ring-0 w-full">
                                    <SelectValue placeholder="Sélectionner une heure" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-bgGray">
                                    <SelectItem value="09:00">09:00</SelectItem>
                                    <SelectItem value="10:00">10:00</SelectItem>
                                    <SelectItem value="11:00">11:00</SelectItem>
                                    <SelectItem value="12:00">12:00</SelectItem>
                                    <SelectItem value="13:00">13:00</SelectItem>
                                    <SelectItem value="14:00">14:00</SelectItem>
                                    <SelectItem value="15:00">15:00</SelectItem>
                                    <SelectItem value="16:00">16:00</SelectItem>
                                    <SelectItem value="17:00">17:00</SelectItem>
                                    <SelectItem value="18:00">18:00</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Note */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Note
                            </label>
                            <Textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="min-h-[100px] text-[14px] border-colorBorder dark:bg-transparent shadow-none focus-visible:ring-0 resize-none"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-3 px-6 py-4 border-t border-colorBorder">
                    <Button
                        variant="outline"
                        onClick={() => closeDialog("coachingDialog")}
                        className="h-10 px-5 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none flex-1 dark:bg-bgCard dark:border-colorBorder cursor-pointer"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handlePlanifier}
                        className="h-10 px-5 bg-primaryColor text-white hover:bg-primaryColor/90 gap-2 shadow-none flex-1 cursor-pointer"
                    >
                        <Calendar size={16} />
                        Planifier
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalCoaching;
