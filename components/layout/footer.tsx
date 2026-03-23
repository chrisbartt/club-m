
import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Youtube,
  Facebook,
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
                href="https://api.whatsapp.com/send?phone=243850572634"
                className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="whatsapp"
                target="_blank"
              >
                <svg className="w-5 h-6 text-white" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path></svg>
              </Link>
              <Link
                href="/"
                className="w-10 h-10 rounded-lg border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </Link>
              
              
            </div>
          </div>

          {/* Colonnes de navigation */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-12 gap-4">
              {/* Navigation */}
              <div className="col-span-12 lg:col-span-4">
                <h3 className="text-xl lg:text-xl text-[#a55b46] mb-3 font-medium">
                  Menu
                </h3>
                <ul className="flex gap-2 flex-col">
                  <li>
                    <Link
                      href="/a-propos"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Le Club
                    </Link>
                  </li>
                  <li className="hidden">
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
                      Devenir membre
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/a-propos"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Découvrir la communauté
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="text-white hover:text-[#a55b46] transition-colors lg:text-[16px] text-[14px]"
                    >
                      Se connecter à son compte.
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
