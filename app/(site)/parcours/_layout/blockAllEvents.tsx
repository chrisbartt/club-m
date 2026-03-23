// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Search, MapPin, ListFilter } from "lucide-react";

const BlockAllEvents = () => {
  return (
    <div className="block-contact lg:py-[100px] py-[50px] bg-[#f5f5f5] relative z-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 gap-4 items-center lg:mb-16 mb-6 lg:mt-[-128px]">
          <div className="col-span-12 lg:col-span-3">
            <div className="flex items-center gap-2">
              <Button className="bg-white text-[#091626] h-[42px] rounded-lg shadow-none">
                <ListFilter size={18} />
                <span className="text-sm ">
                  Filtres
                </span>
              </Button>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="filters-category text-center flex justify-center">
              <ul className="list-ctegory flex white-space-nowrap gap-2 overflow-x-auto p-2 rounded-full bg-white">
                <li>
                  <Link
                    href="/evenements"
                    className="text-[#091626] rounded-full py-3 px-5 text-sm bg-[#f5f5f5] inline-flex items-center justify-center font-medium"
                  >
                    Tous les événements
                  </Link>
                </li>
                <li>
                  <Link
                    href="/evenements"
                    className="text-[#091626] rounded-full py-3 px-5 text-sm inline-flex items-center justify-center font-medium"
                  >
                    Conférences
                  </Link>
                </li>
                <li>
                  <Link
                    href="/evenements"
                    className="text-[#091626] rounded-full py-3 px-5 text-sm inline-flex items-center justify-center font-medium"
                  >
                    Lunchs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/evenements"
                    className="text-[#091626] rounded-full py-3 px-5 text-sm inline-flex items-center justify-center font-medium"
                  >
                    Atéliers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-3">
            <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#a55b46]"></div>
                      Conférence
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner4.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#e1c593]"></div>
                      Lunchs
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner3.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#66a381]"></div>
                      Atélier
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner6.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#a55b46]"></div>
                      Conférence
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner7.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#a55b46]"></div>
                      Conférence
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner4.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#e1c593]"></div>
                      Lunchs
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner3.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#66a381]"></div>
                      Atélier
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner6.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#a55b46]"></div>
                      Conférence
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner7.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#a55b46]"></div>
                      Conférence
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner4.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#e1c593]"></div>
                      Lunchs
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner3.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#66a381]"></div>
                      Atélier
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner6.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3">
            <Link href="/evenements/1">
              <div className="card bg-white rounded-xl p-2">
                <div className="card-img lg:h-[200px] h-[150px] relative  z-10">
                  <div className="flex items-center p-2">
                    <div className="bagde inline-flex items-center justify-center text-xs gap-1 font-medium bg-white text-[#091626] rounded-full px-2 py-1">
                      <div className="bubble w-2 h-2 rounded-full bg-[#a55b46]"></div>
                      Conférence
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 w-full h-full -z-10 overflow-hidden rounded-lg">
                    <Image
                      src="/images/banner7.jpg"
                      alt="Event 1"
                      fill
                      className="object-cover "
                    />
                  </div>
                  <div className="price bg-[#091626] text-white flex items-center justify-center w-[60px] h-[60px] rounded-xl font-semibold absolute -bottom-6 right-3">
                    60$
                  </div>
                </div>
                <div className="card-content p-3">
                  <div className="date flex items-center gap-1 mb-2 mt-1">
                    <Calendar size={18} className="text-[#a55b46]" />
                    <span className="text-sm text-muted-foreground">
                      16/12/2025
                    </span>
                  </div>
                  <h3 className="lg:text-xl font-medium mb-2 line-clamp-2">
                    Business Women Lunch
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={16} />
                    <span className="text-sm text-muted-foreground">
                      La Maison Hobah
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockAllEvents;
