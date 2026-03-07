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
import { useDialog } from "@/context/dialog/contextDialog";
import { Send, X } from "lucide-react";
import { useState } from "react";

const ModalMessage = () => {
    const { isDialogOpen, closeDialog } = useDialog();
    const [messageType, setMessageType] = useState("encouragement");
    const [objet, setObjet] = useState("On pense à toi ! 💛");
    const [message, setMessage] = useState(
        "Chère membre,\n\nJ'espère que tu vas bien ! J'ai remarqué que tu n'es pas venue sur Club M depuis quelques temps."
    );
    const [sendEmail, setSendEmail] = useState(true);
    const [sendWhatsApp, setSendWhatsApp] = useState(true);

    const handleSend = () => {
        // Send message logic here
        closeDialog("messageDialog");
    };

    return (
        <Dialog
            open={isDialogOpen("messageDialog")}
            onOpenChange={() => closeDialog("messageDialog")}
        >
            <DialogContent
                className="sm:max-w-lg w-full border-0 bg-bgCard rounded-[24px] pt-0 gap-0 max-h-[calc(100%_-_8rem)] flex flex-col p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 overflow-hidden"
                showCloseButton={false}
            >
                <DialogHeader className="relative flex-row items-center justify-between gap-0 py-4 px-6 border-b border-colorBorder">
                    <DialogTitle className="text-lg font-semibold text-colorTitle">
                        Envoyer un message
                    </DialogTitle>
                    <button
                        onClick={() => closeDialog("messageDialog")}
                        className="text-colorMuted hover:text-colorTitle transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </DialogHeader>

                <div className="overflow-y-auto overflow-hidden flex-1 px-6 py-5 relative z-10">
                    <div className="flex flex-col gap-5">
                        {/* Type */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Type
                            </label>
                            <Select value={messageType} onValueChange={setMessageType}>
                                <SelectTrigger className="!h-11 text-[14px] border-colorBorder dark:bg-transparent shadow-none focus:ring-0 w-full">
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-bgGray">
                                    <SelectItem value="encouragement">💪 Encouragement</SelectItem>
                                    <SelectItem value="relance">🔔 Relance</SelectItem>
                                    <SelectItem value="information">ℹ️ Information</SelectItem>
                                    <SelectItem value="felicitation">🎉 Félicitation</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Objet */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Objet
                            </label>
                            <Input
                                type="text"
                                value={objet}
                                onChange={(e) => setObjet(e.target.value)}
                                placeholder="Objet du message"
                                className="h-11 text-[14px] border-colorBorder dark:bg-transparent shadow-none focus-visible:ring-0"
                            />
                        </div>

                        {/* Message */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Message
                            </label>
                            <Textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Contenu du message"
                                className="min-h-[120px] text-[14px] border-colorBorder dark:bg-transparent shadow-none focus-visible:ring-0 resize-none"
                            />
                        </div>

                        {/* Canal */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-colorTitle">
                                Canal
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="email"
                                        checked={sendEmail}
                                        onCheckedChange={(checked: boolean) => setSendEmail(checked)}
                                        className="border-colorBorder data-[state=checked]:bg-bgSidebar data-[state=checked]:border-bgSidebar dark:data-[state=checked]:border-primaryColor dark:data-[state=checked]:bg-primaryColor dark:data-[state=checked]:text-white"
                                    />
                                    <label
                                        htmlFor="email"
                                        className="text-[13px] text-colorTitle cursor-pointer"
                                    >
                                        Email
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="whatsapp"
                                        checked={sendWhatsApp}
                                        onCheckedChange={(checked: boolean) => setSendWhatsApp(checked)}
                                        className="border-colorBorder data-[state=checked]:bg-bgSidebar data-[state=checked]:border-bgSidebar dark:data-[state=checked]:border-primaryColor dark:data-[state=checked]:bg-primaryColor dark:data-[state=checked]:text-white"
                                    />
                                    <label
                                        htmlFor="whatsapp"
                                        className="text-[13px] text-colorTitle cursor-pointer"
                                    >
                                        WhatsApp
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-3 px-6 py-4 border-t border-colorBorder">
                    <Button
                        variant="outline"
                        onClick={() => closeDialog("messageDialog")}
                        className="h-10 px-5 border-colorBorder text-colorTitle hover:bg-bgGray shadow-none flex-1 cursor-pointer dark:bg-bgCard dark:border-colorBorder "
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSend}
                        className="h-10 px-5 bg-primaryColor text-white hover:bg-primaryColor/90 gap-2 shadow-none flex-1 cursor-pointer"
                    >
                        <Send size={16} />
                        Envoyer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModalMessage;
