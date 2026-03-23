"use client";

import { useMenu } from "@/context/menu-context";
import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const navLinks = [
  { href: "/a-propos", label: "Le Club" },
  { href: "/business-aligne", label: "Business Aligné" },
  { href: "/evenements", label: "Événements" },
  { href: "/annuaires", label: "Membres" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function ResponsiveMenu() {
  const { isOpen, setIsOpen } = useMenu();
  const pathname = usePathname();

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

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Backdrop - Tailwind only */}
      <div
        aria-hidden={!isOpen}
        onClick={handleClose}
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel - slide from right, Tailwind only */}
      <div
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 h-full w-full max-w-[320px] sm:max-w-[380px] bg-[#faf9f7] z-[9999] flex flex-col overflow-y-auto px-6 py-6 shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <Link href="/" onClick={handleClose}>
            <Image
              src="/logos/logo2.png"
              alt="Club M"
              width={48}
              height={48}
              className="h-10 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className="flex justify-center items-center w-10 h-10 rounded-xl transition-colors relative"
            aria-label="Fermer le menu"
          >
            <span className="block w-5 h-0.5 rounded-full bg-[#091626] rotate-45 absolute" />
            <span className="block w-5 h-0.5 rounded-full bg-[#091626] -rotate-45 absolute" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 mt-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleClose}
                className={`py-3 px-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "text-[#a55b46] bg-[#a55b46]/10"
                    : "text-[#091626] hover:bg-black/5 hover:text-[#a55b46]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-black/10 flex flex-col gap-3">
          <Link
            href="/devenir-membre"
            onClick={handleClose}
            className="w-full py-3.5 px-4 rounded-xl bg-[#a55b46] text-white font-semibold text-center hover:bg-[#8a4a3a] transition-colors"
          >
            Devenir membre
          </Link>
          <Link
            href="/login"
            onClick={handleClose}
            className="w-full py-3.5 px-4 rounded-xl bg-[#151516] text-white font-semibold text-center hover:bg-[#151516]/5 transition-colors inline-flex items-center justify-center gap-2"
          >
            <UserRound className="w-5 h-5" />
            Se connecter
          </Link>
        </div>
      </div>
    </>
  );
}
