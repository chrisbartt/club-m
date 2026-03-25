"use client";

import { useSidebar } from "@/context/sidebar-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Bell, Menu, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const businessPageConfig: Record<string, { title: string; subtitle: string }> = {
  "/mon-business": {
    title: "Vue d'ensemble",
    subtitle: "Tableau de bord et indicateurs clés",
  },
  "/mon-business/commandes": {
    title: "Commandes",
    subtitle: "Gestion de vos commandes",
  },
  "/mon-business/produits": {
    title: "Produits",
    subtitle: "Gestion de vos produits",
  },
  "/mon-business/produits/nouveau": {
    title: "Nouveau produit",
    subtitle: "Ajouter un produit à votre catalogue",
  },
  "/mon-business/clients": {
    title: "Clients",
    subtitle: "Vos clients et historique",
  },
  "/mon-business/revenus": {
    title: "Revenus",
    subtitle: "Suivi de vos revenus",
  },
};

function getBusinessPageConfig(pathname: string) {
  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  // Exact match
  if (businessPageConfig[normalizedPathname]) {
    return businessPageConfig[normalizedPathname];
  }

  // Partial match (longest first)
  const matchingKeys = Object.keys(businessPageConfig)
    .filter(
      (key) =>
        key !== "/mon-business" && normalizedPathname.startsWith(key),
    )
    .sort((a, b) => b.length - a.length);

  if (matchingKeys.length > 0) {
    return businessPageConfig[matchingKeys[0]];
  }

  // Default for /mon-business root
  if (normalizedPathname === "/mon-business") {
    return businessPageConfig["/mon-business"];
  }

  return {
    title: "Mon business",
    subtitle: "Espace commerce",
  };
}

const BusinessNavbar = () => {
  const pathname = usePathname();
  const { setIsOpen } = useSidebar();
  const { title, subtitle } = getBusinessPageConfig(pathname);
  const { initials } = useCurrentUser();

  return (
    <div className="navbar cardShadow sticky top-0 bg-bgNavbar md:py-[16px] py-[12px] backdrop-blur-[10px] z-50">
      <div className="container-fluid lg:px-4 px-3 2xl:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Title & Subtitle */}
          <div className="flex-1 min-w-0 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex lg:hidden text-colorTitle justify-end items-center cursor-pointer btn-show-sidebar p-2 -m-2"
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
            <Link
              href="/mon-business"
              className="flex md:hidden items-center gap-2 w-[63%] justify-center"
            >
              <Image
                src="/logos/logo2.png"
                alt="Club M"
                width={32}
                height={32}
                className="w-10 h-10 object-contain shrink-0 dark:hidden"
                unoptimized
              />
              <Image
                src="/logos/logo1.png"
                alt="Club M"
                width={32}
                height={32}
                className="w-10 h-10 object-contain shrink-0 hidden dark:block"
                unoptimized
              />
            </Link>
            <div className="hidden md:block">
              <h1 className="text-[16px] lg:text-[20px] font-semibold text-colorTitle leading-tight truncate mb-1 hidden md:block">
                {title}
              </h1>
              <p className="text-[12px] lg:text-[13px] text-colorMuted font-medium leading-tight truncate hidden md:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Ajouter produit */}
            <Link
              href="/mon-business/produits/nouveau"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primaryColor rounded-lg text-[13px] font-medium text-white hover:opacity-90 transition-all duration-300 cursor-pointer h-10"
            >
              <Plus size={16} />
              <span>Ajouter produit</span>
            </Link>

            {/* Notification Bell */}
            <Link
              className="w-[36px] h-[36px] border relative border-colorBorder rounded-full flex items-center justify-center text-colorMuted hover:text-colorTitle transition-all duration-300"
              href="/mon-business"
            >
              <div className="indice absolute w-2 h-2 bg-red-500 rounded-full right-0 top-0"></div>
              <Bell size={18} />
            </Link>

            {/* User Avatar */}
            <Link
              href="/profil"
              className="w-[36px] h-[36px] bg-bgSidebar dark:bg-bgGray rounded-full flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              {initials || "??"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessNavbar;
