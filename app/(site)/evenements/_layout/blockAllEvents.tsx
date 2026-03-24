"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Search, MapPin, ListFilter } from "lucide-react";
import { CURRENCY_SYMBOLS } from "@/lib/constants";

type EventItem = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  location: string;
  startDate: string | Date;
  endDate: string | Date;
  category: string;
  status: string;
  prices: { price: number | { toNumber?: () => number }; currency: string }[];
};

type EventType = "A venir" | "En cours" | "Terminé";

const CATEGORY_COLORS: Record<string, string> = {
  "Conference": "#a55b46",
  "Conférence": "#a55b46",
  "Lunch": "#e1c593",
  "Lunchs": "#e1c593",
  "Atelier": "#66a381",
  "Atélier": "#66a381",
};

const FALLBACK_EVENTS = [
  { id: "1", title: "Business Women Lunch", slug: "1", coverImage: "/images/events/event-1.jpg", location: "Kinshasa", startDate: "2026-03-27", endDate: "2026-03-27", category: "Lunchs", status: "PUBLISHED", prices: [{ price: 60, currency: "USD" }] },
  { id: "2", title: "Crée des connexions.Rencontre des femmes entrepreneures qui comprennent tes défis et partagent ton ambition.", slug: "2", coverImage: "/images/events/event-2.jpg", location: "Espace Kin", startDate: "2025-12-20", endDate: "2025-12-20", category: "Lunchs", status: "COMPLETED", prices: [{ price: 35, currency: "USD" }] },
  { id: "3", title: "Apprends autrement.Panels, discussions et retours d'expérience concrets pour faire évoluer ton business.", slug: "3", coverImage: "/images/events/event-3.jpg", location: "Club M Kinshasa", startDate: "2026-01-05", endDate: "2026-01-05", category: "Atélier", status: "PUBLISHED", prices: [{ price: 45, currency: "USD" }] },
  { id: "4", title: "Saisis des opportunités, Clients, collaborations, partenariats… les bonnes rencontres changent tout.", slug: "4", coverImage: "/images/events/event-4.jpg", location: "Rawbank Gombe", startDate: "2026-01-12", endDate: "2026-01-12", category: "Conférence", status: "PUBLISHED", prices: [] },
];

function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatPrice(prices: EventItem["prices"]): string {
  if (!prices || prices.length === 0) return "Gratuit";
  const p = prices[0];
  const amount = typeof p.price === "object" && p.price?.toNumber ? p.price.toNumber() : Number(p.price);
  if (amount === 0) return "Gratuit";
  const symbol = CURRENCY_SYMBOLS[p.currency as keyof typeof CURRENCY_SYMBOLS] ?? p.currency;
  return `${amount}${symbol}`;
}

function getEventType(event: EventItem): EventType {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  if (event.status === "COMPLETED") return "Terminé";
  if (now < start) return "A venir";
  if (now >= start && now <= end) return "En cours";
  return "Terminé";
}

const BlockAllEvents = ({ events }: { events?: EventItem[] }) => {
  const displayEvents = events && events.length > 0 ? events : FALLBACK_EVENTS;

  return (
    <div className="block-all-event lg:py-[100px] lg:pt-[70px] py-[50px] bg-[#f5f5f5] relative z-20" id="EVENTS__S02">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center lg:mb-16 mb-6">
          <div className="col-span-12 lg:col-span-3 order-1 lg:order-none">
            <div className="flex items-center gap-2">
              <Button className="bg-white text-[#091626] h-[42px] rounded-lg shadow-none">
                <ListFilter size={18} />
                <span className="text-sm ">
                  Filtres
                </span>
              </Button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 order-2 lg:order-none">
            <div className="filters-category text-center flex justify-center">
              <ul className="list-ctegory flex white-space-nowrap gap-2 overflow-x-auto p-2 rounded-full bg-white scrollbar-hide">
                <li>
                  <Link
                    href="/evenements"
                    className="text-[#091626] rounded-full py-2.5 md:py-3 px-4 md:px-5 text-xs md:text-sm bg-[#f5f5f5] inline-flex items-center justify-center font-medium shrink-0"
                  >
                    Tous les événements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/evenements"
                    className="text-[#091626] rounded-full py-2.5 md:py-3 px-4 md:px-5 text-xs md:text-sm inline-flex items-center justify-center font-medium shrink-0"
                  >
                    Conférences
                  </Link>
                </li>
                <li>
                  <Link
                    href="/evenements"
                    className="text-[#091626] rounded-full py-2.5 md:py-3 px-4 md:px-5 text-xs md:text-sm inline-flex items-center justify-center font-medium shrink-0"
                  >
                    Lunchs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/evenements"
                    className="text-[#091626] rounded-full py-2.5 md:py-3 px-4 md:px-5 text-xs md:text-sm inline-flex items-center justify-center font-medium shrink-0"
                  >
                    Atéliers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3 order-3 lg:order-none">
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center relative w-full">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search size={18} className="text-[#a55b46]" />
                </div>
                <Input
                  placeholder="Rechercher un événement"
                  className="text-sm pl-10 border-none shadow-none bg-white h-[42px] rounded-lg placeholder:text-muted-foreground placeholder:opacity-70"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {displayEvents.map((event) => {
            const badgeColor = CATEGORY_COLORS[event.category] ?? "#a55b46";
            const eventType = getEventType(event);
            return (
              <div key={event.id} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <Link href={`/evenements/${event.id}`}>
                  <div className="card bg-white rounded-xl p-3 lg:p-2 h-full">
                    <div className="card-img min-h-[160px] sm:min-h-[180px] lg:h-[200px] h-[150px] relative z-10">
                      <div className="flex items-center p-2 gap-1">
                        <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                          <div
                            className="bubble w-2 h-2 rounded-full"
                            style={{ backgroundColor: badgeColor }}
                          />
                          {event.category}
                        </div>
                        <div className={`bagde inline-flex items-center justify-center text-xs gap-1 font-medium rounded-full px-2 py-1 text-center ${eventType === "A venir" ? "bg-[#a55b46] text-white" : eventType === "En cours" ? "bg-[#e1c593] text-black" : "bg-[#66a381] text-white"}`}>
                          {eventType}
                        </div>
                      </div>
                      <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                        <Image
                          src={event.coverImage || "/images/banner4.jpg"}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="price bg-[#151515] text-white flex items-center justify-center w-[70px] h-[40px] rounded-xl font-semibold absolute -bottom-5 right-3">
                        {formatPrice(event.prices)}
                      </div>
                    </div>
                    <div className="card-content p-3">
                      <div className="date flex items-center gap-1 mb-2 mt-1">
                        <Calendar size={18} className="text-[#a55b46]" />
                        <span className="text-sm text-muted-foreground">
                          {formatDate(event.startDate)}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg lg:text-xl font-medium mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin size={16} />
                        <span className="text-sm text-muted-foreground">
                          {event.location}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlockAllEvents;
