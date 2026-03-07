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
import { useDialog } from "@/context/dialog/contextDialog";
import { Bell, Mail, Send, Smartphone, X } from "lucide-react";
import { useState } from "react";

const DIALOG_NAME = "modalNotificationDialog";

type Canal = "email" | "sms" | "app" | "tous";

const ModalNotification = () => {
    const { isDialogOpen, closeDialog } = useDialog();
    const [destinataires, setDestinataires] = useState("tous");
    const [canal, setCanal] = useState<Canal>("email");
    const [objet, setObjet] = useState("");
    const [message, setMessage] = useState("");

    const handleSend = () => {
        // TODO: soumission API
        closeDialog(DIALOG_NAME);
    };

    const canalOptions: { id: Canal; label: string; icon: React.ReactNode }[] = [
        { id: "email", label: "Email", icon: <Mail size={18} className="text-colorMuted" /> },
        { id: "sms", label: "SMS", icon: <Smartphone size={18} className="text-colorMuted" /> },
        { id: "app", label: "App (Push)", icon: <Smartphone size={18} className="text-colorMuted" /> },
        { id: "tous", label: "Tous", icon: <Bell size={18} className="text-colorMuted" /> },
    ];

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
                        Envoyer une notification
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
                        {/* Destinataires * */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Destinataires <span className="text-[#dc2626]">*</span>
                            </label>
                            <Select value={destinataires} onValueChange={setDestinataires}>
                                <SelectTrigger className="h-11 text-[14px] border-colorBorder shadow-none focus:ring-0 w-full">
                                    <SelectValue placeholder="Sélectionner les destinataires" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tous">Tous les membres (156)</SelectItem>
                                    <SelectItem value="fiables">Membres fiables (112)</SelectItem>
                                    <SelectItem value="a_surveiller">À surveiller (32)</SelectItem>
                                    <SelectItem value="risque">Risque (12)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Canal d'envoi */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Canal d&apos;envoi
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {canalOptions.map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setCanal(opt.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer border ${canal === opt.id
                                                ? "border-primaryColor bg-primaryColor/10 text-colorTitle"
                                                : "border-colorBorder bg-bgCard text-colorTitle hover:bg-bgGray"
                                            }`}
                                    >
                                        {opt.icon}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Objet * */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Objet <span className="text-[#dc2626]">*</span>
                            </label>
                            <Input
                                value={objet}
                                onChange={(e) => setObjet(e.target.value)}
                                placeholder="Objet de la notification"
                                className="h-11 text-[14px] border-colorBorder shadow-none focus-visible:ring-0"
                            />
                        </div>

                        {/* Message * */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Message <span className="text-[#dc2626]">*</span>
                            </label>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Contenu du message..."
                                className="min-h-[120px] text-[14px] border-colorBorder shadow-none focus-visible:ring-0 resize-y"
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

export default ModalNotification;
export { DIALOG_NAME as modalNotificationDialogName };
