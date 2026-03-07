"use client";

import AppContainer from "@/components/common/containers/AppContainer";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import ModalMessage from "../../../../components/features/modalMessage/modalMessage";
import CardEvent from "./cardEvent";
import NavTypeEvent, { EVENT_TYPE_LABELS, type EventTypeKey } from "./navTypeEvent";

type EventTypeFilter = Exclude<EventTypeKey, "tous">;

export type EventStatusFilter = "tous" | "a_venir" | "en_cours" | "termine";

const EVENT_STATUS_LABELS: Record<EventStatusFilter, string> = {
    tous: "Tous les statuts",
    a_venir: "À venir",
    en_cours: "En cours",
    termine: "Terminé",
};

interface EventItem {
    id: string;
    type: EventTypeFilter;
    typeLabel: string;
    date: string;
    title: string;
    location: string;
    image?: string;
    priceMin: number;
    priceMax?: number;
    status: EventStatusFilter;
}

// Images : picsum.photos (grains fixes par id) — remplacer par vos assets si besoin
// Images Unsplash : thème aligné sur le titre de chaque événement
const EVENTS_MOCK: EventItem[] = [
    {
        id: "1",
        type: "conferences",
        typeLabel: "Conférence",
        date: "16/12/2025",
        title: "Business Women Lunch",
        location: "La Maison Hobah",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=300&fit=crop",
        priceMin: 60,
        status: "termine",
    },
    {
        id: "2",
        type: "lunchs",
        typeLabel: "Lunch",
        date: "20/12/2025",
        title: "Networking Entrepreneurs",
        location: "Espace Coworking Kinshasa",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop",
        priceMin: 50,
        priceMax: 70,
        status: "termine",
    },
    {
        id: "3",
        type: "ateliers",
        typeLabel: "Atelier",
        date: "05/01/2026",
        title: "Pitch & levée de fonds",
        location: "Hub Innovation",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop",
        priceMin: 120,
        status: "en_cours",
    },
    {
        id: "4",
        type: "conferences",
        typeLabel: "Conférence",
        date: "12/01/2026",
        title: "Leadership & gestion d'équipe",
        location: "Centre des congrès",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=300&fit=crop",
        priceMin: 40,
        priceMax: 80,
        status: "en_cours",
    },
    {
        id: "5",
        type: "formations",
        typeLabel: "Formation",
        date: "18/01/2026",
        title: "Digital marketing avancé",
        location: "En ligne",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
        priceMin: 199,
        status: "a_venir",
    },
    {
        id: "6",
        type: "networking",
        typeLabel: "Networking",
        date: "25/01/2026",
        title: "Afterwork Club M",
        location: "Le Rooftop",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=300&fit=crop",
        priceMin: 25,
        priceMax: 35,
        status: "a_venir",
    },
];

function getCounts(events: EventItem[]) {
    const counts: Partial<Record<EventTypeKey, number>> = {
        tous: events.length,
    };
    (["ateliers", "lunchs", "conferences", "formations", "networking", "autre"] as const).forEach(
        (type) => {
            counts[type] = events.filter((e) => e.type === type).length;
        }
    );
    return counts;
}

const Container = () => {
    const [selectedType, setSelectedType] = useState<EventTypeKey>("tous");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("tous");

    const filteredEvents = useMemo(() => {
        let list = selectedType === "tous" ? EVENTS_MOCK : EVENTS_MOCK.filter((e) => e.type === selectedType);
        if (statusFilter !== "tous") {
            list = list.filter((e) => e.status === statusFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            list = list.filter(
                (e) =>
                    e.title.toLowerCase().includes(q) ||
                    e.location.toLowerCase().includes(q) ||
                    e.typeLabel.toLowerCase().includes(q)
            );
        }
        return list;
    }, [selectedType, statusFilter, searchQuery]);

    const counts = useMemo(() => getCounts(EVENTS_MOCK), []);

    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 grow !pt-0">
                <NavTypeEvent
                    selectedType={selectedType}
                    onSelectType={setSelectedType}
                    counts={counts}
                />
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-6 lg:mt-6 items-center">
                        <div className="col-span-12 lg:col-span-6">
                            <h1 className="md:text-[24px] text-[20px] font-semibold text-colorTitle mt-3 md:mt-0 leading-tight mb-1">
                                {EVENT_TYPE_LABELS[selectedType]}
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez tous vos événements.
                            </p>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <div className="flex md:justify-end gap-2">
                                <div className="relative flex-1 md:flex-initial w-[260px] max-w-full h-10">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-colorTitle pointer-events-none" />
                                    <Input
                                        type="search"
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-full text-[13px] border-0 border-colorBorder text-colorTitle focus-visible:ring-0 focus-visible:ring-offset-0 bg-bgCard shadow-none rounded-lg "
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className="h-10 gap-2 text-[13px] bg-bgCard hover:bg-bgGray shadow-none font-medium text-colorTitle shrink-0 rounded-lg cursor-pointer"
                                        >
                                            {EVENT_STATUS_LABELS[statusFilter]}
                                            <ChevronDown className="size-4 opacity-60" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="min-w-[180px]">
                                        <DropdownMenuLabel>Statut</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup
                                            value={statusFilter}
                                            onValueChange={(v) => setStatusFilter(v as EventStatusFilter)}
                                        >
                                            <DropdownMenuRadioItem value="tous">
                                                Tous les statuts
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="a_venir">
                                                À venir
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="en_cours">
                                                En cours
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="termine">
                                                Terminé
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    className="bg-primaryColor hidden md:flex rounded-lg text-[13px] font-medium text-white hover:bg-primaryColor/90 transition-all duration-300 cursor-pointer h-10 shadow-none gap-2" asChild
                                >
                                    <Link href="/admin/evenements/nouvel-evenement">
                                        <Plus size={18} />
                                        Ajouter un événement
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 md:mt-6 mt-4">
                        {filteredEvents.length === 0 ? (
                            <div className="col-span-12 py-8 text-center text-colorMuted text-[14px]">
                                Aucun événement dans cette catégorie.
                            </div>
                        ) : (
                            filteredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="col-span-12 lg:col-span-4 xl:col-span-3"
                                >
                                    <Link href={`/admin/evenements/${event.id}`} className="block">
                                        <CardEvent
                                            type={event.type}
                                            typeLabel={event.typeLabel}
                                            date={event.date}
                                            title={event.title}
                                            location={event.location}
                                            image={event.image}
                                            priceMin={event.priceMin}
                                            priceMax={event.priceMax}
                                        />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <ModalMessage />
        </AppContainer>
    );
};

export default Container;
