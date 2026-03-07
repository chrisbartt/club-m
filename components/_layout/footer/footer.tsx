
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer py-[50px] lg:pt-[70px] bg-[#151516] relative z-30">
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="container px-4 mx-auto">
        

        <div className="grid grid-cols-12 gap-4 lg:gap-10">
          {/* Colonne gauche - Logo et description */}
          <div className="col-span-12 lg:col-span-4">
            {/* Logo */}
            <div className="mb-4">
              <Link href="/" className="flex items-center mr-10">
                <Image
                  src="/logos/logo1.png"
                  alt="Club M"
                  width={60}
                  height={60}
                  layout="responsive"
                  className={`md:w-[100px!important] w-[80px!important] h-auto`}
                />
              </Link>
            </div>

            {/* Description */}
            <p className="text-white opacity-80 text-[16px] lg:text-[18px] mb-6 max-w-md">
            Le réseau qui transforme ta vision en business.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              <Link
                href="/"
                className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="https://www.youtube.com/@le_club_m"
                className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="YouTube"
                target="_blank"
              >
                <Youtube className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="/"
                className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="/"
                className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </Link>
              <Link
                href="/"
                className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Colonnes de navigation */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12 gap-4">
              {/* Navigation */}
              <div className="col-span-12 lg:col-span-4">
                <h3 className="text-xl lg:text-xl text-[#a55b46] mb-3 font-medium">
                  Navigation
                </h3>
                <ul className="flex gap-2 flex-col">
                  <li>
                    <Link
                      href="/a-propos"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Le CLub
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/business-aligne"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Business aligné
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/evenements"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Evénements
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/annuaires"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Membres
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/journal"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Journal
                    </Link>
                  </li>
                  
                  
                </ul>
              </div>

              {/* Membres */}
              <div className="col-span-12 lg:col-span-4">
                <h3 className="text-xl lg:text-xl text-[#a55b46] mb-3 font-medium">
                  Membres
                </h3>
                <ul className="flex gap-2 flex-col">
                  <li>
                    <Link
                      href="/devenir-membre"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Deviens membre
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/a-propos"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Découvre la communaute
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Connecte-toi à ton compte.
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/support"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="col-span-12 lg:col-span-4">
                <h3 className="text-xl lg:text-xl text-[#a55b46] mb-3 font-medium">
                  Contact
                </h3>
                <ul className="flex gap-2 flex-col">
                  <li>
                    <Link
                      href="/contact"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Nous contacter
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="mailto:contact@clubm.cd"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      contact@clubm.cd
                    </Link>
                  </li>
                  <li className="text-white lg:text-[16px] text-[14px]">
                    Kinshasa, RDC
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-white opacity-[0.1] my-10 mt-14" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white text-[14px] opacity-50">
            &copy; {new Date().getFullYear()} Club M. Tous droits réservés.
          </p>
          <div className="flex gap-4 items-center">
            <Link
              href="/mentions-legales"
              className="text-white text-[14px] opacity-50 hover:text-[#a55b46] hover:opacity-100 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/mentions-legales#cookies"
              className="text-white text-[14px] opacity-50 hover:text-[#a55b46] hover:opacity-100 transition-colors"
            >
              Politique de cookies
            </Link>
            <Link
              href="/mentions-legales#donnees"
              className="text-white text-[14px] opacity-50 hover:text-[#a55b46] hover:opacity-100 transition-colors"
            >
              Données personnelles
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
