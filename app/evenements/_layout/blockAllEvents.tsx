// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Search, MapPin, ListFilter } from "lucide-react";

const EVENTS = [
  { id: "1", image: "https://images.pexels.com/photos/7731327/pexels-photo-7731327.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Conférence", badgeColor: "#a55b46", price: "60$", date: "16/12/2025", title: "Business Women Lunch", location: "La Maison Hobah" },
  { id: "2", image: "https://images.pexels.com/photos/6829538/pexels-photo-6829538.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Lunchs", badgeColor: "#e1c593", price: "35$", date: "20/12/2025", title: "Networking & Pitch", location: "Espace Kin" },
  { id: "3", image: "https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Atélier", badgeColor: "#66a381", price: "45$", date: "05/01/2026", title: "Pitch parfait : structurer son idée", location: "Club M Kinshasa" },
  { id: "4", image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Conférence", badgeColor: "#a55b46", price: "Gratuit", date: "12/01/2026", title: "Femmes et finance : accéder au crédit", location: "Rawbank Gombe" },
  { id: "5", image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Conférence", badgeColor: "#a55b46", price: "50$", date: "18/01/2026", title: "Leadership au féminin", location: "Pullman Hôtel" },
  { id: "6", image: "https://images.pexels.com/photos/8770079/pexels-photo-8770079.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Lunchs", badgeColor: "#e1c593", price: "40$", date: "25/01/2026", title: "Business Women Lunch", location: "La Maison Hobah" },
  { id: "7", image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Atélier", badgeColor: "#66a381", price: "55$", date: "01/02/2026", title: "Marketing digital pour entrepreneures", location: "Espace Kin" },
  { id: "8", image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Conférence", badgeColor: "#a55b46", price: "60$", date: "08/02/2026", title: "Scaling : passer à l'échelle", location: "Club M Kinshasa" },
  { id: "9", image: "https://images.pexels.com/photos/7688332/pexels-photo-7688332.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Conférence", badgeColor: "#a55b46", price: "Gratuit", date: "15/02/2026", title: "Découverte Club M", location: "Siège Club M" },
  { id: "10", image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Lunchs", badgeColor: "#e1c593", price: "38$", date: "22/02/2026", title: "Lunch & Learn : gestion de trésorerie", location: "La Maison Hobah" },
  { id: "11", image: "https://images.pexels.com/photos/7674572/pexels-photo-7674572.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Atélier", badgeColor: "#66a381", price: "50$", date: "01/03/2026", title: "Atelier business plan", location: "Espace Kin" },
  { id: "12", image: "https://images.pexels.com/photos/7176033/pexels-photo-7176033.jpeg?auto=compress&cs=tinysrgb&w=800", badgeLabel: "Conférence", badgeColor: "#a55b46", price: "70$", date: "10/03/2026", title: "Success Stories : elles ont réussi", location: "Pullman Hôtel" },
];

const BlockAllEvents = () => {
  return (
    <div className="block-contact lg:py-[100px] py-[50px] bg-[#f5f5f5] relative z-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 lg:gap-6 items-center lg:mb-16 mb-6 mt-[-40px] md:mt-[-80px] lg:mt-[-128px]">
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
          {EVENTS.map((event) => (
            <div key={event.id} className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Link href={`/evenements/${event.id}`}>
                <div className="card bg-white rounded-xl p-3 lg:p-2 h-full">
                  <div className="card-img min-h-[160px] sm:min-h-[180px] lg:h-[200px] h-[150px] relative z-10">
                    <div className="flex items-center p-2">
                      <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                        <div
                          className="bubble w-2 h-2 rounded-full"
                          style={{ backgroundColor: event.badgeColor }}
                        />
                        {event.badgeLabel}
                      </div>
                    </div>
                    <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                      {event.price}
                    </div>
                  </div>
                  <div className="card-content p-3">
                    <div className="date flex items-center gap-1 mb-2 mt-1">
                      <Calendar size={18} className="text-[#a55b46]" />
                      <span className="text-sm text-muted-foreground">
                        {event.date}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockAllEvents;
