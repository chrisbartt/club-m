"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";

// Types
interface NoteItem {
    id: string;
    initials: string;
    author: string;
    date: string;
    content: string;
}

// Note Row Component
const NoteRow = ({ initials, author, date, content }: NoteItem) => {
    return (
        <div className="flex gap-3 p-4 bg-bgGray rounded-xl">
            {/* Avatar */}
            <div className="w-[36px] h-[36px] rounded-full bg-bgSidebar flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">
                {initials}
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold text-colorTitle">{author}</span>
                    <span className="text-[12px] text-colorMuted">{date}</span>
                </div>
                <p className="text-[13px] text-colorMuted leading-relaxed">{content}</p>
            </div>
        </div>
    );
};

// Mock Data
const notesData: NoteItem[] = [
    {
        id: "1",
        initials: "MD",
        author: "Marie D.",
        date: "20 Déc",
        content: "Session coaching productive. Vision claire. Besoin d'aide sur la partie finance du BP.",
    },
    {
        id: "2",
        initials: "MA",
        author: "Maurelle",
        date: "15 Nov",
        content: "Upgrade vers Premium. Très motivée par le programme.",
    },
];

const CardNote = () => {
    const [newNote, setNewNote] = useState("");

    const handleAddNote = () => {
        if (newNote.trim()) {
            // Add note logic here
            setNewNote("");
        }
    };

    return (
        <div className="card cardShadow w-full bg-bgCard rounded-xl overflow-hidden py-5 px-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[16px] font-semibold text-colorTitle">Notes internes</h3>
            </div>

            {/* Notes List */}
            <div className="flex flex-col gap-3 mb-4">
                {notesData.map((note) => (
                    <NoteRow key={note.id} {...note} />
                ))}
            </div>

            {/* Add Note Form */}
            <div className="flex flex-col gap-3">
                <Textarea
                    placeholder="Ajouter une note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[80px] text-[13px] border-colorBorder resize-none shadow-none focus-visible:ring-0"
                />
                <Button
                    onClick={handleAddNote}
                    className="w-full bg-primaryColor text-white hover:bg-primaryColor/90 gap-2 shadow-none cursor-pointer"
                >
                    <Plus size={16} />
                    Ajouter
                </Button>
            </div>
        </div>
    );
};

export default CardNote;
