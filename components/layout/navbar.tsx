"use client";

import { useMenu } from "@/context/menu-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

const navLinks = [
  { href: "/a-propos", label: "Le Club" },
  // { href: "/business-aligne", label: "Business Aligné" },
  { href: "/evenements", label: "Événements" },
  { href: "/annuaires", label: "Membres" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { setIsOpen } = useMenu();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 40); // Active à partir de 50px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <nav>
        <div className="container mx-auto md:px-4 px-3 lg:py-6 py-4 flex items-center">
          <div className="flex lg:justify-between w-full gap-3">
            <div
              className={`flex items-center min-w-0 w-full lg:w-auto rounded-xl p-3 md:px-5 backdrop-blur-[10px] transition-all duration-300 ${
                scrolled ? "bg-[#f8f8f8]/60" : "bg-black/30"
              }`}
            >
              <Link href="/" className="flex items-center mr-10">
                <Image
                  src="/logos/logo1.png"
                  alt="Club M"
                  width={60}
                  height={60}
                  layout="responsive"
                  className={`md:w-[60px!important] w-[50px!important] ${
                    scrolled ? "hidden" : "inline-block"
                  }`}
                />
                <Image
                  src="/logos/logo2.png"
                  alt="Club M"
                  width={60}
                  height={60}
                  layout="responsive"
                  className={`md:w-[60px!important] w-[50px!important] h-auto  ${
                    scrolled ? "inline-block" : "hidden"
                  }`}
                />
              </Link>
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href ||
                        pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`transition-colors font-medium ${
                        isActive
                          ? "text-[#a55b46]"
                          : `${
                              scrolled ? "text-black" : "text-white"
                            } hover:text-[#a55b46]`
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
               {/* Menu mobile : hamburger */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex flex-col w-10 h-10 rounded-xl justify-center items-center gap-1.5 transition-colors shrink-0"
                // style={{
                //   background: scrolled ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.2)",
                // }}
                aria-label="Ouvrir le menu"
              >
                <span
                  className="block w-5 h-0.5 rounded-full transition-colors"
                  style={{ background: scrolled ? "#091626" : "#fff" }}
                />
                <span
                  className="block w-4 h-0.5 rounded-full transition-colors"
                  style={{ background: scrolled ? "#091626" : "#fff" }}
                />
              </button>
            </div>
            </div>

            <div className="lg:flex hidden items-center gap-3">
              <Link
                href="/devenir-membre"
                className="px-6 py-2 inline-flex h-full items-center justify-center bg-[#a55b46] text-white rounded-xl hover:bg-[#a55b46]/80 hover:text-white transition-colors font-medium"
              >
                Devenir membre
              </Link>
              <Button
                asChild
                // className="px-6 py-2 inline-flex h-full items-center justify-center bg-black backdrop-blur-[10px] text-white rounded-xl hover:bg-black/80 cursor-pointer hover:text-white transition-colors font-medium shadow-none"
                className="p-0 h-full w-18 inline-flex  items-center justify-center bg-[#151516] backdrop-blur-[10px] text-white rounded-xl hover:bg-[#151516]/80 cursor-pointer hover:text-white transition-colors font-medium shadow-none"
              >
                <Link href="/login">
                  <UserRound className="w-[24px!important] h-[24px!important]" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
