"use client";

import { useSidebar } from "@/context/sidebar-context";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Bell, Download, Menu, MessageSquare, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Configuration des pages Admin
const adminPageConfig: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Dashboard global",
    subtitle: "Performance du Club M (7 derniers jours)",
  },
  "/admin/membres": {
    title: "Gestion des membres",
    subtitle: "Gestion et suivi des membres du Club M",
  },
  "/admin/epargne-tontines": {
    title: "Épargne / Tontines",
    subtitle: "Gestion des tontines et épargnes",
  },
  "/admin/evenements": {
    title: "Événements",
    subtitle: "Calendrier et gestion des événements",
  },
  "/admin/marketplace": {
    title: "Marketplace",
    subtitle: "Annuaire et marketplace du Club M",
  },
  "/admin/coachs": {
    title: "Coachs",
    subtitle: "Gestion des coachs et accompagnateurs",
  },
  "/admin/messages": {
    title: "Messages",
    subtitle: "Messagerie et communications",
  },
  "/admin/statistiques": {
    title: "Statistiques",
    subtitle: "Analyses et rapports détaillés",
  },
  "/admin/parametres": {
    title: "Paramètres",
    subtitle: "Configuration de la plateforme",
  },
  "/admin/notifications": {
    title: "Notifications",
    subtitle: "Centre de notifications",
  },
};

// Configuration des pages Membre
const membrePageConfig: Record<string, { title: string; subtitle: string }> = {
  "/membre": {
    title: "Mon tableau de bord",
    subtitle: "Bienvenue dans ton espace Club M",
  },
  "/membre/business-alignes": {
    title: "Business Aligné",
    subtitle: "Ton parcours Business Aligné est en cours",
  },
  "/membre/epargne-tontines": {
    title: "Épargne Intelligente",
    subtitle: "Rejoins des tontines digitales sécurisées",
  },
  "/membre/formations": {
    title: "Formations",
    subtitle: "Développe tes compétences business",
  },
  "/membre/marketplace": {
    title: "Ma Marketplace",
    subtitle: "Gère tes offres et suis tes ventes",
  },
  "/membre/evenements": {
    title: "Événements",
    subtitle: "Découvre et participe aux événements Club M",
  },
  "/membre/messages": {
    title: "Messages",
    subtitle: "Tes conversations et communications",
  },
  "/membre/membres": {
    title: "Annuaire membres",
    subtitle: "Découvre et contacte les membres du Club M",
  },
};

// Fonction pour obtenir la config de la page
const getPageConfig = (pathname: string) => {
  const isMembre = pathname.startsWith("/membre");
  const config = isMembre ? membrePageConfig : adminPageConfig;

  // Normaliser le pathname
  const normalizedPathname =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  // Cherche une correspondance exacte
  if (config[normalizedPathname]) {
    return config[normalizedPathname];
  }

  // Cherche une correspondance partielle (pour les sous-routes)
  // Trier par longueur décroissante pour prendre la correspondance la plus spécifique
  const matchingKeys = Object.keys(config)
    .filter(
      (key) =>
        key !== "/admin" &&
        key !== "/membre" &&
        normalizedPathname.startsWith(key),
    )
    .sort((a, b) => b.length - a.length);

  if (matchingKeys.length > 0) {
    return config[matchingKeys[0]];
  }

  // Si on est sur la page d'accueil admin ou membre
  if (normalizedPathname === "/admin" || normalizedPathname === "/membre") {
    return config[normalizedPathname] || config[normalizedPathname + "/"];
  }

  // Valeur par défaut selon le contexte
  return {
    title: isMembre ? "Club M" : "Club M",
    subtitle: isMembre ? "Espace membre" : "Administration",
  };
};

const Navbar = () => {
  const pathname = usePathname();
  const { setIsOpen } = useSidebar();
  const { title, subtitle } = getPageConfig(pathname);
  const isMembre = pathname.startsWith("/membre");
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
              href="/admin"
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
            {/* Boutons pour les membres */}
            {isMembre ? (
              <>
                {/* Bouton Télécharger mon dossier */}
                <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-colorBorder rounded-lg text-[13px] font-medium text-colorTitle hover:bg-bgGray transition-all duration-300 cursor-pointer h-10 bg-bgCard">
                  <Download size={16} />
                  <span>Télécharger mon dossier</span>
                </button>

                {/* Bouton Contacter Maurelle */}
                <Link
                  href="/membre/messages"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primaryColor rounded-lg text-[13px] font-medium text-white hover:opacity-90 transition-all duration-300 cursor-pointer h-10"
                >
                  <MessageSquare size={16} />
                  <span>Contacter Maurelle</span>
                </Link>
              </>
            ) : (
              <>
                {/* Export Button - Seulement pour admin */}
                <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-colorBorder rounded-lg text-[13px] font-medium text-colorTitle hover:bg-bgGray transition-all duration-300 cursor-pointer h-10">
                  <Download size={16} />
                  <span>Exporter les stats</span>
                </button>

                {/* Create Button - Admin */}
                <Link
                  href="/admin/evenements/nouvel-evenement"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primaryColor rounded-lg text-[13px] font-medium text-white hover:opacity-90 transition-all duration-300 cursor-pointer h-10"
                >
                  <Plus size={16} />
                  <span>Créer un événement</span>
                </Link>
              </>
            )}

            {/* Notification Bell */}
            <Link
              className="w-[36px] h-[36px] border relative border-colorBorder rounded-full flex items-center justify-center text-colorMuted hover:text-colorTitle transition-all duration-300"
              href={isMembre ? "/membre/messages" : "/admin/notifications"}
            >
              <div className="indice absolute w-2 h-2 bg-red-500 rounded-full right-0 top-0"></div>
              <Bell size={18} />
            </Link>

            {/* User Avatar - lien vers la page d'accueil */}
            <Link
              href="/"
              className="w-[36px] h-[36px] bg-bgSidebar dark:bg-bgGray rounded-full flex items-center justify-center text-white text-[13px] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
            >
              {initials || "??"}
            </Link>

            {/* Mobile Menu */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
