// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Youtube, Facebook } from "lucide-react";
import Link from "next/link";
const BlockContact = () => {
  return (
    <div className="block-contact lg:py-[100px] py-[50px] bg-[#f5f5f5]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 lg:gap-14 gap-4 items-center">
          <div className="col-span-12 lg:col-span-6">
            <h4 className="text-2xl lg:text-[36px] leading-[1.2] font-semibold text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
              Tu as une question sur le Club M ou souhaites-tu rejoindre la
              communauté, proposer un partenariat ou en savoir plus sur nos
              activités ?
            </h4>
            <h5 className="text-2xl lg:text-[32px] leading-[1.2] font-medium italic text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
              Nous serons ravies d’échanger avec toi.
            </h5>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="card bg-white rounded-2xl overflow-hidden p-4 md:p-16">
              <div className="grid grid-cols-12 gap-0">
                <div className="col-span-12">
                  <div className="text-left">
                    <h4 className="text-xl lg:text-3xl font-semibold text-black mb-2 ">
                      Tu peux nous écrire directement via le formulaire
                      ci-dessous.
                    </h4>
                    <p className="text-[#091626]/70 mb-3 lg:mb-10 lg:text-[18px] text-[16px]">
                      Nous te répondrons dans les meilleurs délais.
                    </p>
                    <div className="grid grid-cols-12 lg:gap-10 gap-6">
                      <div className="col-span-12 ">
                        <div className="flex flex-col gap-4">
                          <div>
                            <label
                              htmlFor="nom"
                              className="block mb-2 font-medium text-[#151516]"
                            >
                              Nom
                            </label>
                            <Input
                              type="text"
                              id="nom"
                              name="nom"
                              className={`shadow-none h-[52px] lg:text-[16px]  focus-visible:ring-0 focus-visible:border-black rounded-lg`}
                              required
                              placeholder="Votre Nom"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="prenom"
                              className="block mb-2 font-medium text-[#151516]"
                            >
                              Prénom
                            </label>
                            <Input
                              type="text"
                              id="prenom"
                              name="prenom"
                              className={`shadow-none h-[52px] lg:text-[16px] focus-visible:ring-0 focus-visible:border-black rounded-lg`}
                              required
                              placeholder="Votre prénom"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block mb-2 font-medium text-[#151516]"
                            >
                              Email
                            </label>
                            <Input
                              type="email"
                              id="email"
                              name="email"
                              className={`shadow-none h-[52px] lg:text-[16px]  focus-visible:ring-0 focus-visible:border-black rounded-lg`}
                              required
                              placeholder="Votre adresse email"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="objet"
                              className="block mb-2 font-medium text-[#151516]"
                            >
                              Objet
                            </label>
                            <Input
                              type="text"
                              id="objet"
                              name="objet"
                              className={`shadow-none h-[52px] lg:text-[16px]  focus-visible:ring-0 focus-visible:border-black rounded-lg`}
                              required
                              placeholder="Votre objet"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="message"
                              className="block mb-2 font-medium text-[#151516]"
                            >
                              Message
                            </label>
                            <Textarea
                              id="message"
                              name="message"
                              rows={5}
                              className={`shadow-none resize-none  lg:text-[16px] border-[#0000000f] focus-visible:ring-0 focus-visible:border-black rounded-lg`}
                              required
                              placeholder="Votre message"
                            />
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button className="bg-[#a55b46] text-white h-14 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-xl">
                              Envoyer votre message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12">
            <h4 className="text-center w-3xl max-w-full mx-auto text-2xl lg:text-[36px] leading-[1.2] font-semibold text-[#091626] mb-2 lg:mb-4 tracking-[-0.02em]">
              Tu peux également suivre les activités du Club M sur nos réseaux :
            </h4>
            <div className="flex gap-3 justify-center">
              <Link
                href="/"
                className="w-10 h-10 rounded-lg  bg-white text-[#151516] flex items-center justify-center hover:text-[#a55b46] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@le_club_m"
                className="w-10 h-10 rounded-lg  bg-white text-[#151516] flex items-center justify-center hover:text-[#a55b46] transition-colors"
                aria-label="YouTube"
                target="_blank"
              >
                <Youtube className="w-5 h-5" />
              </Link>
              <Link
                href="https://api.whatsapp.com/send?phone=243850572634"
                className="w-10 h-10 rounded-lg  bg-white text-[#151516] flex items-center justify-center hover:text-[#a55b46] transition-colors"
                aria-label="whatsapp"
                target="_blank"
              >
                <svg
                  className="w-5 h-6 "
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                </svg>
              </Link>
              <Link
                href="/"
                className="w-10 h-10 rounded-lg  bg-white text-[#151516] flex items-center justify-center hover:text-[#a55b46] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockContact;
