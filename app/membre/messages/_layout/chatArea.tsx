"use client";

import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
    id: string;
    text: string;
    timestamp: string;
    isOwn: boolean;
    sender: string;
}

const ChatArea = () => {
    const [message, setMessage] = useState("");

    const messages: Message[] = [
        {
            id: "1",
            text: "Bonjour Marie ! Comment vas-tu ?",
            timestamp: "14:30",
            isOwn: false,
            sender: "Maurelle",
        },
        {
            id: "2",
            text: "Bonjour Maurelle, je vais très bien merci ! J'ai quelques questions sur mon Business Plan.",
            timestamp: "14:32",
            isOwn: true,
            sender: "Marie",
        },
        {
            id: "3",
            text: "Parfait, je suis là pour t'aider. Quelles sont tes questions ?",
            timestamp: "14:33",
            isOwn: false,
            sender: "Maurelle",
        },
        {
            id: "4",
            text: "Je me demande comment bien structurer ma partie financière...",
            timestamp: "14:35",
            isOwn: true,
            sender: "Marie",
        },
    ];

    const handleSend = () => {
        if (message.trim()) {
            // Logique d'envoi de message
            setMessage("");
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-bgFond">
            {/* Header */}
            <div className="bg-bgCard border-b border-colorBorder p-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#25a04f] flex items-center justify-center text-white text-[14px] font-semibold">
                            M
                        </div>
                        <div>
                            <h3 className="text-[16px] font-semibold text-colorTitle">Maurelle</h3>
                            <p className="text-[12px] text-colorMuted flex items-center gap-1">
                                <span className="w-2 h-2 bg-[#25a04f] rounded-full"></span>
                                En ligne
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-colorBorder hover:bg-bgGray transition-colors">
                            <Phone size={18} className="text-colorTitle" />
                        </button>
                        <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-colorBorder hover:bg-bgGray transition-colors">
                            <Video size={18} className="text-colorTitle" />
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                                    <MoreVertical size={18} className="text-colorTitle" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                                <DropdownMenuItem>Archiver</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`max-w-[70%] lg:max-w-[60%] ${msg.isOwn ? "order-2" : "order-1"}`}>
                            {!msg.isOwn && (
                                <p className="text-[12px] text-colorMuted mb-1 px-2">{msg.sender}</p>
                            )}
                            <div
                                className={`px-4 py-2.5 ${
                                    msg.isOwn
                                        ? "bg-primaryColor/40 text-colorTitle rounded-t-2xl rounded-bl-2xl"
                                        : "bg-bgCard text-colorTitle rounded-b-2xl rounded-tr-2xl"
                                }`}
                            >
                                <p className="text-[14px] leading-relaxed">{msg.text}</p>
                                <p className={`text-[11px] mt-1 ${
                                    msg.isOwn ? "text-colorTitle/70" : "text-colorMuted"
                                }`}>
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="bg-bgCard border-t border-colorBorder p-4">
                <div className="flex items-end gap-2">
                    <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-colorBorder hover:bg-bgGray transition-colors flex-shrink-0">
                        <Paperclip size={18} className="text-colorTitle" />
                    </button>
                    <div className="flex-1 relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Tapez votre message..."
                            rows={1}
                            className="w-full px-4 py-2.5 pr-10 text-[14px] border border-colorBorder rounded-lg bg-bgCard text-colorTitle placeholder:text-colorMuted focus:outline-none focus:border-bgSidebar transition-all duration-200 resize-none max-h-[120px]"
                        />
                        <button className="absolute right-2 bottom-2 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-bgGray transition-colors">
                            <Smile size={16} className="text-colorMuted" />
                        </button>
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-primaryColor hover:bg-primaryColor/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
