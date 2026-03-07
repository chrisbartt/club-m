"use client";

import { Search, Crown, Gem, Sprout } from "lucide-react";
import { useState } from "react";

interface Conversation {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
    isOnline?: boolean;
    avatar?: string;
    isSelected?: boolean;
    statut?: "business" | "premium" | "free";
}

const ConversationsSidebar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedId, setSelectedId] = useState<string>("1");

    const conversations: Conversation[] = [
        {
            id: "1",
            name: "Marie Kabila",
            lastMessage: "Bonjour, j'ai une question sur mon Business Plan...",
            timestamp: "Il y a 2h",
            unreadCount: 2,
            isOnline: true,
            statut: "business",
        },
        {
            id: "2",
            name: "Sophie Mwamba",
            lastMessage: "Merci pour votre réponse, c'est très clair maintenant",
            timestamp: "Hier",
            isOnline: false,
            statut: "premium",
        },
        {
            id: "3",
            name: "Jean Kasongo",
            lastMessage: "Je souhaite modifier ma demande d'adhésion",
            timestamp: "Il y a 2 jours",
            unreadCount: 1,
            isOnline: true,
            statut: "free",
        },
        {
            id: "4",
            name: "Clarisse Ndaya",
            lastMessage: "Parfait, je vais suivre vos conseils",
            timestamp: "Il y a 3 jours",
            isOnline: false,
            statut: "business",
        },
    ];

    const getStatutBadge = (statut?: string) => {
        if (!statut) return null;
        switch (statut) {
            case "business":
                return (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#e68b3c]/10 text-[#e68b3c]">
                        <Crown size={10} />
                        Business
                    </span>
                );
            case "premium":
                return (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#8c49b1]/10 text-[#8c49b1]">
                        <Gem size={10} />
                        Premium
                    </span>
                );
            case "free":
                return (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#25a04f]/10 text-[#25a04f]">
                        <Sprout size={10} />
                        Free
                    </span>
                );
        }
    };

    const filteredConversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full lg:w-[350px] dark:border-l border-r border-colorBorder bg-bgCard flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 border-b border-colorBorder">
                <h2 className="text-[18px] font-semibold text-colorTitle mb-4">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-colorMuted" />
                    <input
                        type="text"
                        placeholder="Rechercher une conversation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-[13px] border border-colorBorder rounded-lg bg-bgCard text-colorTitle placeholder:text-colorMuted focus:outline-none focus:border-bgSidebar transition-all duration-200"
                    />
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="p-8 text-center text-colorMuted text-[14px]">
                        Aucune conversation trouvée
                    </div>
                ) : (
                    <div className="divide-y divide-colorBorder">
                        {filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedId(conv.id)}
                                className={`p-4 cursor-pointer transition-colors ${
                                    selectedId === conv.id
                                        ? "bg-bgGray dark:bg-bgGray"
                                        : "hover:bg-bgGray"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-white text-[14px] font-semibold ${
                                            conv.isOnline ? "bg-[#25a04f]" : "bg-bgSidebar"
                                        }`}>
                                            {conv.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </div>
                                        {conv.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25a04f] border-2 border-bgCard rounded-full"></div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <h3 className={`text-[14px] font-semibold truncate ${
                                                    selectedId === conv.id ? "text-colorTitle" : "text-colorTitle"
                                                }`}>
                                                    {conv.name}
                                                </h3>
                                                {getStatutBadge(conv.statut)}
                                            </div>
                                            <span className={`text-[11px] flex-shrink-0 ml-2 ${
                                                selectedId === conv.id ? "text-colorMuted" : "text-colorMuted"
                                            }`}>
                                                {conv.timestamp}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-[13px] truncate ${
                                                selectedId === conv.id ? "text-colorMuted" : "text-colorMuted"
                                            }`}>
                                                {conv.lastMessage}
                                            </p>
                                            {conv.unreadCount && conv.unreadCount > 0 && (
                                                <span className="flex-shrink-0 w-5 h-5 bg-[#d92828] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationsSidebar;
