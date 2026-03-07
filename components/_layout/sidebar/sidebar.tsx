"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/context/sidebarContext/sidebarContext";
import {
  BarChart3,
  Calendar,
  CalendarDays,
  ChevronDown,
  Compass,
  File,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Monitor,
  Moon,
  Palette,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LinkNav from "./linkNav";

type ThemeValue = "light" | "dark" | "system";

const THEME_OPTIONS: {
  value: ThemeValue;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "light", label: "Clair", icon: <Sun size={16} /> },
  { value: "dark", label: "Sombre", icon: <Moon size={16} /> },
  { value: "system", label: "Système", icon: <Monitor size={16} /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, setIsOpen } = useSidebar();
  const isMembre = pathname.startsWith("/membre");
  const { theme, setTheme } = useTheme();
  const currentLabel =
    THEME_OPTIONS.find((o) => o.value === (theme ?? "system"))?.label ??
    "Système";

  const homeHref = isMembre ? "/membre" : "/admin";
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop mobile - fermer seulement si on clique directement sur le fond (pas sur la sidebar ni les dropdowns) */}
      <div
        aria-hidden={!isOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
        className={`fixed inset-0 z-[1000]  bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`sidebar fixed flex flex-col top-0 left-0 w-[250px] h-full bg-bgSidebar z-[9999] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div className="header p-[16px] px-[20px] border-b border-white/10">
          <div className="flex items-center w-full gap-2">
            <Link
              href={homeHref}
              onClick={handleClose}
              className="logoApp flex items-center gap-2 flex-1 min-w-0"
            >
              <Image
                src="/logos/logo1.png"
                alt="Club M"
                width={32}
                height={32}
                className="w-8 h-8 object-contain shrink-0"
                unoptimized
              />
            </Link>

            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`badge text-white text-[11px] font-medium !px-2 py-1 !gap-1 rounded-md h-auto hover:opacity-90 cursor-pointer hover:text-white border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${isMembre ? "bg-emerald-500 hover:bg-emerald-600" : "bg-[#3b82f6] hover:bg-[#2563eb]"}`}
                  >
                    {isMembre ? "Membre" : "Admin"}
                    <ChevronDown size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px] z-[10000]" sideOffset={6}>
                  <DropdownMenuLabel>Espace</DropdownMenuLabel>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={() => router.push("/admin")}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={() => router.push("/membre")}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Membre
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              className="md:hidden shrink-0 w-8 h-8 bg-[#152131] text-white hover:bg-white/10"
              onClick={handleClose}
              aria-label="Fermer le menu"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        <div
          className="body flex grow flex-col overflow-y-auto py-[20px] px-[16px]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#ffffff3f transparent",
          }}
        >
          {isMembre ? (
            <>
              {/* MON ESPACE - Membre */}
              <h6 className="text-white/60 text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
                MON ESPACE
              </h6>
              <ul className="list-links mb-4">
                <li>
                  <LinkNav
                    href="/membre"
                    icon={<LayoutDashboard size={20} />}
                    title="Tableau de bord"
                  />
                </li>
              </ul>

              {/* MES MODULES - Membre */}
              <h6 className="text-white/60 text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
                MES MODULES
              </h6>
              <ul className="list-links mb-4">
                <li>
                  <LinkNav
                    href="/membre/business-alignes"
                    icon={<Compass size={20} />}
                    title="Business Aligné"
                  />
                </li>
              </ul>

              {/* COMMUNAUTÉ - Membre */}
              <h6 className="text-white/60 text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
                COMMUNAUTÉ
              </h6>
              <ul className="list-links mb-4">
                <li>
                  <LinkNav
                    href="/membre/evenements"
                    icon={<CalendarDays size={20} />}
                    title="Événements"
                    badge={1}
                  />
                </li>
                <li>
                  <LinkNav
                    href="/membre/messages"
                    icon={<MessageSquare size={20} />}
                    title="Messages"
                    badge={3}
                  />
                </li>
                <li>
                  <LinkNav
                    href="/annuaires"
                    icon={<Users size={20} />}
                    title="Annuaire membres"
                  />
                </li>
              </ul>
            </>
          ) : (
            <>
              {/* PRINCIPAL - Admin */}
              <h6 className="text-colorMuted text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
                Principal
              </h6>
              <ul className="list-links mb-4">
                <li>
                  <LinkNav
                    href="/admin"
                    icon={<LayoutDashboard size={20} />}
                    title="Dashboard"
                  />
                </li>
              </ul>

              {/* GESTION - Admin */}
              <h6 className="text-colorMuted text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
                Gestion
              </h6>
              <ul className="list-links mb-4">
                <li>
                  <LinkNav
                    href="/admin/membres"
                    icon={<Users size={20} />}
                    title="Membres"
                    badge={12}
                  />
                </li>
                {/* <li>
                <LinkNav href="/admin/business-plans" icon={<FileText size={20} />} title="Business Plans" />
              </li> */}
                <li>
                  <LinkNav
                    href="/admin/business-alignes"
                    icon={<File size={20} />}
                    title="Business Alignés"
                  />
                </li>
                {/* <li>
                <LinkNav href="/admin/epargne-tontines" icon={<PiggyBank size={20} />} title="Épargne / Tontines" badge={3} />
              </li> */}
                <li>
                  <LinkNav
                    href="/admin/evenements"
                    icon={<CalendarDays size={20} />}
                    title="Événements"
                  />
                </li>
              </ul>

              {/* ACCOMPAGNEMENT - Admin */}
              <h6 className="text-colorMuted text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
                Accompagnement
              </h6>
              <ul className="list-links mb-4">
                <li>
                  <LinkNav
                    href="/admin/coachs"
                    icon={<GraduationCap size={20} />}
                    title="Coachs"
                  />
                </li>
                <li>
                  <LinkNav
                    href="/admin/rendez-vous"
                    icon={<Calendar size={20} />}
                    title="Rendez-vous"
                  />
                </li>
                <li>
                  <LinkNav
                    href="/admin/messages"
                    icon={<MessageSquare size={20} />}
                    title="Messages"
                  />
                </li>
              </ul>

              {/* SYSTÈME - Admin */}
              <h6 className="text-colorMuted text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
                Système
              </h6>
              <ul className="list-links mb-4">
                <li>
                  <LinkNav
                    href="#"
                    icon={<BarChart3 size={20} />}
                    title="Statistiques"
                  />
                </li>
                <li>
                  <LinkNav
                    href="#"
                    icon={<Settings size={20} />}
                    title="Paramètres"
                  />
                </li>
              </ul>
            </>
          )}
        </div>
      <div className="footer px-[16px] py-[16px] border-t border-white/10" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button className="block-theme w-full bg-[#ffffff0d] py-[12px] px-[14px] rounded-lg backdrop-blur-[10px] flex items-center justify-between hover:bg-white/10 text-white border-0 h-auto font-medium cursor-pointer focus-visible:ring-0 focus-visible:ring-offset-0">
              <div className="flex items-center gap-2">
                <Palette size={20} />
                <span className="text-sm">Thème</span>
              </div>
              <span
                className="text-sm text-white/70"
                suppressHydrationWarning
              >
                {currentLabel}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            className="min-w-[160px] z-[10000] dark:bg-bgGray dark:border-0"
          >
            <DropdownMenuLabel>Préférence de thème</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme ?? "system"}
              onValueChange={(value) => setTheme(value as ThemeValue)}
            >
              {THEME_OPTIONS.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  className="gap-2 cursor-pointer"
                >
                  {option.icon}
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
