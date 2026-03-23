"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

type BannerProps = {
  categoryLabel: string;
  title: string;
  featuredImage: string;
  date?: string;
  readingTime?: string;
};

const Banner = ({
  categoryLabel,
  title,
  featuredImage,
  date,
  readingTime,
}: BannerProps) => {
  return (
    <div className="banner relative z-10">
      <div className="overlay absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-20" />
      <div className="content-img absolute top-0 left-0 w-full h-full -z-20">
        <Image
          src={featuredImage}
          alt=""
          fill
          className="object-cover w-full h-full"
          sizes="100vw"
          priority
        />
      </div>
      <div className="content-banner min-h-[70vh] lg:min-h-[85vh] flex flex-col justify-end items-center py-14 lg:py-[80px] pb-16">
        <div className="container mt-auto px-4">
          <div className="grid grid-cols-12 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-8">
              <nav
                className="flex items-center gap-2 text-sm text-white/80 mb-4"
                aria-label="Fil d'Ariane"
              >
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </Link>
                <ChevronRight className="w-4 h-4 shrink-0" />
                <Link
                  href="/journal"
                  className="hover:text-white transition-colors"
                >
                  Journal
                </Link>
                <ChevronRight className="w-4 h-4 shrink-0" />
                <span className="text-white/90 capitalize">
                  {categoryLabel}
                </span>
              </nav>
              <span className="inline-block text-white/90 text-xs font-semibold uppercase tracking-wider mb-3">
                {categoryLabel}
              </span>
              <h1 className="text-3xl lg:text-[56px] font-medium text-white mb-4 tracking-[-0.02em] leading-tight">
                {title}
              </h1>
              {(date || readingTime) && (
                <div className="flex flex-wrap gap-6 text-white/90 text-sm">
                  {date && <span>{date}</span>}
                  {readingTime && <span>{readingTime}</span>}
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
