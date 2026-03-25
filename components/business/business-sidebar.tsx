"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/context/sidebar-context";
import {
  ArrowLeft,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Package,
  Palette,
  ShoppingCart,
  Sun,
  Users,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import LinkNav from "@/components/layout/link-nav";

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

const BusinessSidebar = () => {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const currentLabel =
    THEME_OPTIONS.find((o) => o.value === (theme ?? "system"))?.label ??
    "Système";

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
      {/* Backdrop mobile */}
      <div
        aria-hidden={!isOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
        className={`fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
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
        {/* Dotted pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* Header */}
        <div className="header p-[16px] px-[20px] border-b border-white/10">
          <div className="flex items-center w-full gap-2">
            <Link
              href="/mon-business"
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

            <span className="badge text-white text-[11px] font-medium px-2 py-1 rounded-md bg-emerald-500">
              Business
            </span>
            <Button
              className="md:hidden shrink-0 w-8 h-8 bg-[#152131] text-white hover:bg-white/10"
              onClick={handleClose}
              aria-label="Fermer le menu"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Body */}
        <div
          className="body flex grow flex-col overflow-y-auto py-[20px] px-[16px]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#ffffff3f transparent",
          }}
        >
          {/* COMMERCE */}
          <h6 className="text-white/60 text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
            COMMERCE
          </h6>
          <ul className="list-links mb-4">
            <li>
              <LinkNav
                href="/mon-business"
                icon={<LayoutDashboard size={20} />}
                title="Vue d'ensemble"
              />
            </li>
            <li>
              <LinkNav
                href="/mon-business/commandes"
                icon={<ShoppingCart size={20} />}
                title="Commandes"
              />
            </li>
            <li>
              <LinkNav
                href="/mon-business/produits"
                icon={<Package size={20} />}
                title="Produits"
              />
            </li>
          </ul>

          {/* CLIENTS */}
          <h6 className="text-white/60 text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
            CLIENTS
          </h6>
          <ul className="list-links mb-4">
            <li>
              <LinkNav
                href="/mon-business/clients"
                icon={<Users size={20} />}
                title="Clients"
              />
            </li>
          </ul>

          {/* ANALYTICS */}
          <h6 className="text-white/60 text-[11px] font-medium mb-2 uppercase tracking-wider px-[16px]">
            ANALYTICS
          </h6>
          <ul className="list-links mb-4">
            <li>
              <LinkNav
                href="/mon-business/revenus"
                icon={<BarChart3 size={20} />}
                title="Revenus"
              />
            </li>
          </ul>

          {/* Retour espace membre */}
          <div className="mt-2 mb-4">
            <Link
              href="/dashboard"
              onClick={handleClose}
              className="flex items-center gap-3 w-full px-[16px] py-[10px] text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Mon espace</span>
            </Link>
          </div>

          {/* Déconnexion */}
          <div className="mt-auto pt-4">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-3 w-full px-[16px] py-[10px] text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Se déconnecter</span>
            </button>
          </div>
        </div>

        {/* Footer — Theme switcher */}
        <div
          className="footer px-[16px] py-[16px] border-t border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
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

export default BusinessSidebar;
