"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { CURRENCY_SYMBOLS } from "@/lib/constants";

type EventItem = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  location: string;
  startDate: string | Date;
  category: string;
  prices: { price: number | { toNumber?: () => number }; currency: string }[];
};

const CATEGORY_COLORS: Record<string, string> = {
  "Conference": "#a55b46",
  "Conférence": "#a55b46",
  "Lunch": "#e1c593",
  "Lunchs": "#e1c593",
  "Atelier": "#66a381",
  "Atélier": "#66a381",
};

const FALLBACK_EVENTS: EventItem[] = [
  { id: "1", title: "Business Women Lunch", slug: "1", coverImage: "/images/banner4.jpg", location: "La Maison Hobah", startDate: "2025-12-16", category: "Conférence", prices: [{ price: 60, currency: "USD" }] },
  { id: "2", title: "Business Women Lunch", slug: "2", coverImage: "/images/banner3.jpg", location: "La Maison Hobah", startDate: "2025-12-16", category: "Lunchs", prices: [{ price: 60, currency: "USD" }] },
  { id: "3", title: "Business Women Lunch", slug: "3", coverImage: "/images/banner6.jpg", location: "La Maison Hobah", startDate: "2025-12-16", category: "Atélier", prices: [{ price: 60, currency: "USD" }] },
  { id: "4", title: "Business Women Lunch", slug: "4", coverImage: "/images/banner7.jpg", location: "La Maison Hobah", startDate: "2025-12-16", category: "Conférence", prices: [{ price: 60, currency: "USD" }] },
  { id: "5", title: "Business Women Lunch", slug: "5", coverImage: "/images/banner4.jpg", location: "La Maison Hobah", startDate: "2025-12-16", category: "Conférence", prices: [{ price: 60, currency: "USD" }] },
  { id: "6", title: "Business Women Lunch", slug: "6", coverImage: "/images/banner3.jpg", location: "La Maison Hobah", startDate: "2025-12-16", category: "Lunchs", prices: [{ price: 60, currency: "USD" }] },
  { id: "7", title: "Business Women Lunch", slug: "7", coverImage: "/images/banner6.jpg", location: "La Maison Hobah", startDate: "2025-12-16", category: "Atélier", prices: [{ price: 60, currency: "USD" }] },
  { id: "8", title: "Business Women Lunch", slug: "8", coverImage: "/images/banner7.jpg", location: "La Maison Hobah", startDate: "2025-12-16", category: "Conférence", prices: [{ price: 60, currency: "USD" }] },
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

const BlockEvent = ({ events }: { events?: EventItem[] }) => {
  const displayEvents = events && events.length > 0 ? events.slice(0, 8) : FALLBACK_EVENTS;

  return (
    <div className="block-contact lg:py-[100px] lg:pt-[350px] py-[50px] bg-[#f8f8f8] relative z-10">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 gap-4 items-center lg:mb-16 mb-0 lg:mt-[-128px]">
              <div className="col-span-12 lg:col-span-6">
                <h3 className="text-sm lg:text-base uppercase font-medium text-[#a55b46] mb-3 relative inline-block pb-3">
                  Nos événements
                  <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
                </h3>
                <h2 className="text-2xl lg:text-4xl font-medium  text-[#091626] mb-2 lg:mb-3">
                  Nos événements
                </h2>
                <p className="text-muted-foreground mb-6 md:mb-6 lg:text-[18px] text-[16px]">
                  Networking, formations et moments d&apos;échange exclusifs.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-6 hidden md:block">
                <div className="flex md:justify-end">
                  <Button
                    className="bg-[#091626] text-white h-12 hover:bg-[#091626]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg"
                    asChild
                  >
                    <Link href="/evenements">Tous les événements</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              {displayEvents.map((event) => {
                const badgeColor = CATEGORY_COLORS[event.category] ?? "#a55b46";
                return (
                  <div key={event.id} className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
                    <Link href={`/evenements/${event.id}`}>
                      <div className="card bg-white rounded-xl p-2">
                        <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                          <div className="flex items-center p-2">
                            <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                              <div
                                className="bubble w-2 h-2 rounded-full"
                                style={{ backgroundColor: badgeColor }}
                              />
                              {event.category}
                            </div>
                          </div>
                          <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                            <Image
                              src={event.coverImage || "/images/banner4.jpg"}
                              alt={event.title}
                              fill
                              className="object-cover "
                            />
                          </div>
                          <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
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
                          <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
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
          <div className="col-span-1 hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockEvent;
