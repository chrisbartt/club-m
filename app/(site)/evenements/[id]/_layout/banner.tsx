"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

type SerializedEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: string;
  accessLevel: string;
  prices: { price: number; currency: string; targetRole: string }[];
  ticketsSold: number;
};

const scrollToPricing = () => {
  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
};

const scrollToChoice = () => {
  document.getElementById("choice")?.scrollIntoView({ behavior: "smooth" });
};

function formatBannerDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

const Banner = ({ event }: { event?: SerializedEvent }) => {
  const title = event?.title ?? "Businesswomen Lunch";
  const description = event?.description ?? "L\u2019\u00e9v\u00e9nement o\u00f9 les femmes entrepreneures se connectent, apprennent et cr\u00e9ent des opportunit\u00e9s de business.";
  const dateLabel = event ? formatBannerDate(event.startDate) : "26 Mars 2026";
  const coverImage = event?.coverImage ?? "/images/banner-event.jpg";

  return (
    <div className="banner-devenir-membre relative z-10">
      <div className="overlay absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-40"></div>
      <div className="content-img absolute top-0 left-0 w-full h-full -z-20">
        <Image src={coverImage} alt={title} width={100} height={100} layout="responsive" className="w-[100%!important] h-[100%!important] object-cover" />
      </div>
      <div className="content-banner min-h-[90vh] md:min-h-[60vh] lg:min-h-[95vh] flex flex-col justify-center items-center py-12 md:py-16 lg:py-[100px]">
        <div className="container mt-auto px-4 mx-auto">
          <div className="grid grid-cols-12 gap-4 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-6">
            <div className="flex md:items-center flex-col md:flex-row lg:gap-6 gap-3 mb-2">
              <div>
                <div className="badge border border-white/60 text-white md:px-4 md:py-2 px-2 py-1 rounded-full inline-flex items-center gap-1 text-sm md:text-base">
                  <div className="w-3 h-3 bg-[#e1c593] rounded-full ">
                  </div>
                  Lunch
                </div>
              </div>
                <div className="date text-white md:text-base text-sm">{dateLabel}</div>
              </div>
              <h1 className="text-4xl lg:text-[68px] font-medium text-white mb-3 tracking-[-0.02em]">
              {title}
              </h1>
              <p className="text-white lg:text-xl mb-6 lg:mb-6 max-w-[600px]">
              {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={scrollToPricing} className="bg-[#a55b46] px-5 md:px-6 text-white h-12 md:h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg">
                Réserve ta place
                </Button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
