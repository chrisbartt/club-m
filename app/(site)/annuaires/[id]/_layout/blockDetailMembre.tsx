"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Phone,
  Globe,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Award,
  Calendar,
  ArrowRight,
  Quote,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { ProfileWithProducts } from "@/domains/directory/types";

const DEFAULT_SLIDES = [
  { src: "/images/cover2.png", alt: "Banner 1" },
  { src: "/images/cover3.png", alt: "Banner 2" },
];

const AUTOPLAY_DELAY_MS = 5000;

interface BlockDetailMembreProps {
  profile?: ProfileWithProducts;
}

const BlockDetailMembre = ({ profile }: BlockDetailMembreProps) => {
  const memberName = profile
    ? `${profile.member.firstName} ${profile.member.lastName}`
    : "Maurelle Kitebi";
  const memberFirstName = profile?.member.firstName || "Maurelle";
  const memberAvatar = profile?.member.avatar
    || "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg";
  const businessDescription = profile?.description
    || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.";
  const memberPhone = profile?.phone || "+243 6 99 99 99 99";
  const memberEmail = profile?.email || "info@businessclubm.com";
  const memberAddress = profile?.address || "Kinshasa, Gombe, RDC";
  const memberWebsite = profile?.website || "www.businessclubm.com";
  const memberWhatsapp = profile?.whatsapp || memberPhone;
  const SLIDES = (profile?.images && profile.images.length > 0)
    ? profile.images.map((url, i) => ({ src: url, alt: `Image ${i + 1}` }))
    : DEFAULT_SLIDES;
  const products = profile?.products || [];
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_DELAY_MS);
    return () => clearInterval(interval);
  }, [api, isPaused]);

  const goToSlide = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );
  return (
    <div className="bg-[#f5f5f5] lg:py-[100px] lg:pt-[70px] py-[50px] relative z-10">
      <div className="grid grid-cols-12 gap-3 md:gap-4">
        <div className="col-span-1"></div>
        <div className="col-span-12 lg:col-span-10">
          <div className="px-3">
            <div className="grid grid-cols-12 gap-3 md:gap-8">
              <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                <div className="flex flex-col gap-4 lg:mt-[-150px] md:sticky md:top-[150px]">
                  <div className="card bg-white p-4 lg:p-6 rounded-2xl">
                    <div className="flex items-center gap-3 md:gap-4 mb-3">
                      <div className="avatar md:w-[70px] md:h-[70px] w-[80px] h-[80px] relative mb-3 flex-shrink-0">
                        <div className="icon-badge absolute z-10 -right-1 bottom-2 border-2 border-[#ffffff] h-[24px] w-[24px] bg-[#a55b46] rounded-full flex items-center justify-center">
                          <BadgeCheck className="w-4 h-4 text-white" />
                        </div>
                        <Image
                          src={memberAvatar}
                          fill
                          className="object-cover rounded-full"
                          alt={memberName}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl text-[#091626] font-semibold">
                          {memberName}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-1">
                          Membre Business
                        </p>
                        <div className="badge inline-flex justify-center items-center bg-[#a55b46]/10 text-xs text-[#a55b46] rounded-full px-2 py-1">
                          Certifié par Club M
                        </div>
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-[#091626] mb-1">
                      Bio
                    </h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      {businessDescription}
                    </p>
                    <Link
                      href="/annuaires/1"
                      className="text-sm text-[#091626] hover:text-[#a55b46] transition-colors hidden items-center"
                    >
                      Lire plus <ArrowRight className="w-4 h-4 ml-2" />{" "}
                    </Link>
                    <div className="flex items-center gap-6 mt-6">
                      <Button className="flex-1 bg-[#091626] hover:bg-[#091626]/90 cursor-pointer text-white shadow-none h-12 rounded-xl ">
                        <svg
                          width="34"
                          height="34"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                        </svg>
                        <span className="text-white text-sm font-medium">
                          Ecrire à {memberFirstName}
                        </span>
                      </Button>
                    </div>
                    <hr className="my-4 border-black/10" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#091626] mb-3">
                        Réseaux sociaux
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <a
                          href="https://facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#091626]/5 text-[#091626] hover:bg-[#a55b46] hover:text-white transition-colors"
                          aria-label="Facebook"
                        >
                          <Facebook className="w-5 h-5" />
                        </a>
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#091626]/5 text-[#091626] hover:bg-[#a55b46] hover:text-white transition-colors"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#091626]/5 text-[#091626] hover:bg-[#a55b46] hover:text-white transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a
                          href="https://twitter.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#091626]/5 text-[#091626] hover:bg-[#a55b46] hover:text-white transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                    <hr className="my-4 border-black/10" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#091626] mb-3">
                        Infos rapides
                      </h3>
                      <div className="flex gap-3 flex-col">
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground text-sm">
                            Délai moyen
                          </p>
                          <p className="text-[#091626] text-sm">48h</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground text-sm">Zone</p>
                          <p className="text-[#091626] text-sm">
                            RDC • International
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-muted-foreground text-sm">
                            Paiement
                          </p>
                          <p className="text-[#091626] text-sm">Acompte 50%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
                <Tabs defaultValue="services" className="w-full lg:mt-[-100px]">
                  <TabsList className="bg-white rounded-xl p-2 !h-auto gap-2 flex-wrap">
                    <TabsTrigger
                      value="services"
                      className="data-[state=active]:bg-[#091626] px-3 py-2 cursor-pointer rounded-lg data-[state=active]:text-white md:text-base text-sm"
                    >
                      Infos business
                    </TabsTrigger>
                    <TabsTrigger
                      value="about"
                      className="data-[state=active]:bg-[#091626] px-3 py-2 cursor-pointer rounded-lg data-[state=active]:text-white md:text-base text-sm"
                    >
                      A propos membre
                    </TabsTrigger>

                    <TabsTrigger
                      value="portfolios"
                      className="data-[state=active]:bg-[#091626] px-3 py-2 cursor-pointer rounded-lg data-[state=active]:text-white md:text-base text-sm"
                    >
                      Portfolios
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="about">
                    <div className="lg:mt-6">
                      <h2 className="text-2xl lg:text-3xl text-[#091626] font-semibold mb-1">
                        A propos
                      </h2>
                      <p className="text-muted-foreground text-base mb-6">
                        Courte description de la personne et de son activité.
                      </p>
                      <div className="grid grid-cols-12 gap-3 md:gap-4 items-center ">
                        <div className="col-span-12 lg:col-span-6">
                          <div className="card-img relative w-full lg:w-[90%] h-full lg:min-h-[350px] min-h-[200px] overflow-hidden rounded-xl">
                            <Image
                              src={memberAvatar}
                              fill
                              className="object-cover rounded-xl"
                              alt={memberName}
                            />
                          </div>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                          <div className="flex flex-col h-full">
                            <h5 className="text-4xl font-semibold text-[#091626] mb-2">
                              {memberName}
                            </h5>
                            <p className="text-muted-foreground text-base mb-3">
                              Entrepreneure dans l&apos;immobilier, Maurelle
                              accompagne particuliers et investisseurs dans
                              leurs projets d&apos;acquisition, de location et
                              de valorisation de biens à Kinshasa et en RDC. Son
                              approche allie connaissance du terrain et
                              structuration pour transformer chaque dossier en
                              opportunité.
                            </p>
                            <p className="text-muted-foreground text-base mb-3">
                              Forte de plus de 10 ans d&apos;expérience dans
                              l&apos;accompagnement entrepreneurial, elle a
                              guidé des centaines de femmes sur leur chemin vers
                              le succès.
                            </p>
                            <div className="flex items-center gap-3 flex-wrap mt-4">
                              <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#091626]/5 text-[#091626] hover:bg-[#a55b46] hover:text-white transition-colors"
                                aria-label="Facebook"
                              >
                                <Facebook className="w-5 h-5" />
                              </a>
                              <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#091626]/5 text-[#091626] hover:bg-[#a55b46] hover:text-white transition-colors"
                                aria-label="Instagram"
                              >
                                <Instagram className="w-5 h-5" />
                              </a>
                              <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#091626]/5 text-[#091626] hover:bg-[#a55b46] hover:text-white transition-colors"
                                aria-label="LinkedIn"
                              >
                                <Linkedin className="w-5 h-5" />
                              </a>
                              <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#091626]/5 text-[#091626] hover:bg-[#a55b46] hover:text-white transition-colors"
                                aria-label="Twitter"
                              >
                                <Twitter className="w-5 h-5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-8">
                        <h2 className="text-2xl lg:text-3xl text-[#091626] font-semibold mb-4">
                          Coordonnées de contact
                        </h2>
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-12 md:col-span-6 flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-[#a55b46]/5 flex items-center justify-center">
                              <Phone className="w-5 h-5 text-[#a55b46]" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Téléphone
                              </p>
                              <a
                                href={`tel:${memberPhone.replace(/\s/g, '')}`}
                                className="text-[#091626] font-medium hover:text-[#a55b46] transition-colors"
                              >
                                {memberPhone}
                              </a>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-[#a55b46]/5 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-[#a55b46]" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Email
                              </p>
                              <a
                                href={`mailto:${memberEmail}`}
                                className="text-[#091626] font-medium hover:text-[#a55b46] transition-colors"
                              >
                                {memberEmail}
                              </a>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-[#a55b46]/5 flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-[#a55b46]" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Adresse
                              </p>
                              <p className="text-[#091626] font-medium">
                                {memberAddress}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6 flex items-start gap-3">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-[#a55b46]/5 flex items-center justify-center">
                              <Globe className="w-5 h-5 text-[#a55b46]" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Site web
                              </p>
                              <a
                                href={memberWebsite.startsWith('http') ? memberWebsite : `https://${memberWebsite}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#091626] font-medium hover:text-[#a55b46] transition-colors"
                              >
                                {memberWebsite}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 hidden">
                        <h2 className="text-2xl lg:text-3xl text-[#091626] font-semibold mb-1">
                          Parcours
                        </h2>
                        <p className="text-muted-foreground text-base mb-6">
                          Étapes clés et expériences qui forgent son expertise.
                        </p>
                        <div className="space-y-6">
                          <div className="flex gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-full bg-[#a55b46]/10 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-[#a55b46]" />
                            </div>
                            <div>
                              <p className="text-[#091626] font-semibold">
                                2019 – Aujourd&apos;hui
                              </p>
                              <p className="text-[#091626] font-medium mt-0.5">
                                Fondatrice & Experte immobilière
                              </p>
                              <p className="text-muted-foreground text-sm mt-1">
                                Accompagnement d&apos;investisseurs et
                                particuliers, projets à Kinshasa et en RDC.
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-full bg-[#a55b46]/10 flex items-center justify-center">
                              <Award className="w-6 h-6 text-[#a55b46]" />
                            </div>
                            <div>
                              <p className="text-[#091626] font-semibold">
                                2022
                              </p>
                              <p className="text-[#091626] font-medium mt-0.5">
                                Co-fondatrice Club M
                              </p>
                              <p className="text-muted-foreground text-sm mt-1">
                                Lancement du premier incubateur féminin
                                structurant en RDC.
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-full bg-[#a55b46]/10 flex items-center justify-center">
                              <BriefcaseBusiness className="w-6 h-6 text-[#a55b46]" />
                            </div>
                            <div>
                              <p className="text-[#091626] font-semibold">
                                Avant 2019
                              </p>
                              <p className="text-[#091626] font-medium mt-0.5">
                                Consultante & Conseil
                              </p>
                              <p className="text-muted-foreground text-sm mt-1">
                                Expérience en structuration de projets et
                                accompagnement entrepreneurial.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="portfolios">
                    <div className="lg:mt-6">
                      <h2 className="text-2xl lg:text-3xl text-[#091626] font-semibold mb-1">
                        Portfolios
                      </h2>
                      <p className="text-muted-foreground text-base mb-6">
                        Réalisations et projets réalisés par l&apos;experte.
                      </p>
                      <div className="grid grid-cols-12 gap-3 md:gap-4">
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                          <div>
                            <div className="card-img relative w-full h-[200px] overflow-hidden rounded-xl">
                              <Image
                                src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
                                fill
                                className="object-cover rounded-xl"
                                alt="Projet résidentiel Gombe"
                              />
                            </div>
                            <div className="p-3 px-0">
                              <h5 className="text-lg font-semibold text-[#091626]">
                                Projet résidentiel Gombe
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                          <div>
                            <div className="card-img relative w-full h-[200px] overflow-hidden rounded-xl">
                              <Image
                                src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
                                fill
                                className="object-cover rounded-xl"
                                alt="Villa Lingwala"
                              />
                            </div>
                            <div className="p-3 px-0">
                              <h5 className="text-lg font-semibold text-[#091626]">
                                Villa Lingwala
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                          <div>
                            <div className="card-img relative w-full h-[200px] overflow-hidden rounded-xl">
                              <Image
                                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
                                fill
                                className="object-cover rounded-xl"
                                alt="Terrain Ngaliema"
                              />
                            </div>
                            <div className="p-3 px-0">
                              <h5 className="text-lg font-semibold text-[#091626]">
                                Terrain Ngaliema
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                          <div>
                            <div className="card-img relative w-full h-[200px] overflow-hidden rounded-xl">
                              <Image
                                src="https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg"
                                fill
                                className="object-cover rounded-xl"
                                alt="Immeuble Barumbu"
                              />
                            </div>
                            <div className="p-3 px-0">
                              <h5 className="text-lg font-semibold text-[#091626]">
                                Immeuble Barumbu
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                          <div>
                            <div className="card-img relative w-full h-[200px] overflow-hidden rounded-xl">
                              <Image
                                src="https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg"
                                fill
                                className="object-cover rounded-xl"
                                alt="Résidence Limete"
                              />
                            </div>
                            <div className="p-3 px-0">
                              <h5 className="text-lg font-semibold text-[#091626]">
                                Résidence Limete
                              </h5>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                          <div>
                            <div className="card-img relative w-full h-[200px] overflow-hidden rounded-xl">
                              <Image
                                src="https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
                                fill
                                className="object-cover rounded-xl"
                                alt="Villa Kinshasa"
                              />
                            </div>
                            <div className="p-3 px-0">
                              <h5 className="text-lg font-semibold text-[#091626]">
                                Villa Kinshasa
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="services">
                    <div className="lg:mt-4">
                      <div className="grid grid-cols-12 lg:gap-6 gap-3 items-center mb-4">
                        <div className="col-span-12">
                          <Carousel
                            setApi={setApi}
                            className="w-full"
                            opts={{ loop: true, align: "start", startIndex: 0 }}
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                          >
                            <div className="flex flex-col w-full">
                              <CarouselContent className="w-full ml-0">
                                {SLIDES.map((slide) => (
                                  <CarouselItem key={slide.src} className="pl-0">
                                    <div className="card-img relative w-full h-[300px] lg:h-[420px] rounded-2xl overflow-hidden">
                                      <Image
                                        src={slide.src}
                                        alt={slide.alt}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <div className="flex justify-center absolute bottom-0 left-0 w-full z-10 py-4">
                                <div className="flex gap-2 bg-white/20 backdrop-blur-[20px] rounded-xl p-2 border border-white/20">
                                  {SLIDES.map((slide, index) => (
                                    <button
                                      key={slide.src}
                                      type="button"
                                      onClick={() => goToSlide(index)}
                                      className="view-slider relative w-[80px] h-[50px] rounded-lg cursor-pointer flex items-center justify-center transition-opacity hover:opacity-90"
                                      aria-label={`Voir slide ${index + 1}`}
                                    >
                                      <div
                                        className={`absolute border border-[#ffffff] rounded-lg inset-[-3px] z-10 ${current === index ? "opacity-100" : "opacity-0"}`}
                                      ></div>
                                      <Image
                                        src={slide.src}
                                        alt={slide.alt}
                                        fill
                                        className="object-cover rounded-md"
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <CarouselPrevious className="left-[20px] cursor-pointer" />
                            <CarouselNext className="right-[20px] cursor-pointer" />
                          </Carousel>
                        </div>
                        
                      </div>
                      <div className="flex flex-col md:gap-6 gap-3">
                        <div>
                          <h2 className="text-[#091626] text-xl lg:text-[26px] font-semibold mb-1">
                            Description
                          </h2>
                          <p className="text-muted-foreground text-sm lg:text-base mb-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Rem laudantium sunt, similique odit recusandae
                            unde voluptate beatae molestias, magnam labore
                            pariatur? Unde et modi illum, doloribus inventore
                            magnam perspiciatis est?
                          </p>
                          <p className="text-muted-foreground text-sm lg:text-base mb-3">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Rem laudantium sunt, similique odit recusandae
                            unde voluptate beatae molestias, magnam labore
                            pariatur? Unde et modi illum, doloribus inventore
                            magnam perspiciatis est?
                          </p>
                        </div>
                        <div>
                          <h2 className="text-[#091626] text-xl lg:text-[26px] font-semibold mb-1">
                            Services
                          </h2>
                          <p className="text-muted-foreground text-sm lg:text-base mb-4">
                            Liste des services offerts.
                          </p>
                          <div className="grid grid-cols-12 gap-3 md:gap-4">
                            <div className="col-span-12 lg:col-span-4">
                              <div className="card bg-white p-2 rounded-2xl flex flex-col h-full">
                                <div className="card-img relative w-full h-[160px] overflow-hidden rounded-xl">
                                  <Image
                                    src="https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg"
                                    fill
                                    className="object-cover rounded-xl"
                                    alt="Branding & identité visuelle"
                                  />
                                </div>
                                <div className="p-4 px-3 flex flex-col flex-1">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h5 className="text-lg font-semibold text-[#091626]">
                                      Branding & identité visuelle
                                    </h5>
                                    <span className="shrink-0 text-xs font-medium text-[#a55b46] bg-[#a55b46]/10 rounded-md px-2 py-0.5">
                                      Recommandé
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    Logo, charte, packaging et supports pour une
                                    image cohérente et haut de gamme.
                                  </p>
                                  <h6 className="text-[#091626] text-base font-medium flex flex-col mb-1">
                                    À partir de
                                    <span className="text-xl font-semibold">
                                      300 USD
                                    </span>
                                  </h6>
                                  <p className="text-muted-foreground text-xs">
                                    Livraison 7-10 jours
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                              <div className="card bg-white p-2 rounded-2xl flex flex-col h-full">
                                <div className="card-img relative w-full h-[160px] overflow-hidden rounded-xl">
                                  <Image
                                    src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                                    fill
                                    className="object-cover rounded-xl"
                                    alt="Design & production"
                                  />
                                </div>
                                <div className="p-4 px-3 flex flex-col flex-1">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h5 className="text-lg font-semibold text-[#091626]">
                                      Design & production (digital/print)
                                    </h5>
                                    <span className="shrink-0 text-xs font-medium text-[#a55b46] bg-[#a55b46]/10 rounded-md px-2 py-0.5">
                                      Rapide
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    Visuels pubs, flyers, cartes, bannières,
                                    templates réseaux sociaux, dossiers pro.
                                  </p>
                                  <h6 className="text-[#091626] text-base font-medium flex flex-col mb-1">
                                    À partir de
                                    <span className="text-xl font-semibold">
                                      200 USD
                                    </span>
                                  </h6>
                                  <p className="text-muted-foreground text-xs">
                                    Livraison 3-7 jours
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-12 lg:col-span-4">
                              <div className="card bg-white p-2 rounded-2xl flex flex-col h-full">
                                <div className="card-img relative w-full h-[160px] overflow-hidden rounded-xl">
                                  <Image
                                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                                    fill
                                    className="object-cover rounded-xl"
                                    alt="Campagnes & stratégie marketing"
                                  />
                                </div>
                                <div className="p-4 px-3 flex flex-col flex-1">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h5 className="text-lg font-semibold text-[#091626]">
                                      Campagnes & stratégie marketing
                                    </h5>
                                    <span className="shrink-0 text-xs font-medium text-[#a55b46] bg-[#a55b46]/10 rounded-md px-2 py-0.5">
                                      Performance
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground text-sm mb-3">
                                    Plan de contenu, positionnement, pub, suivi
                                    KPI et optimisation continue.
                                  </p>
                                  <h6 className="text-[#091626] text-base font-medium flex flex-col mb-1">
                                    À partir de
                                    <span className="text-xl font-semibold">
                                      500 USD
                                    </span>
                                  </h6>
                                  <p className="text-muted-foreground text-xs">
                                    Mensuel • Audit inclus
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-[#091626] text-xl lg:text-[26px] font-semibold mb-1">
                            Statistiques
                          </h2>
                          <p className="text-muted-foreground text-sm lg:text-base mb-4">
                            Statistiques du membre.
                          </p>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-4">
                            <div className="bg-white rounded-xl p-4 md:p-5 ">
                              <div className="text-2xl lg:text-2xl font-bold text-[#091626] mb-1">
                                +120
                              </div>
                              <p className="text-muted-foreground text-sm">
                                Projets livrés
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 md:p-5 ">
                              <div className="text-2xl lg:text-2xl font-bold text-[#091626] mb-1">
                                4.8/5
                              </div>
                              <p className="text-muted-foreground text-sm">
                                Satisfaction
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 md:p-5 ">
                              <div className="text-2xl lg:text-2xl font-bold text-[#091626] mb-1">
                                48h
                              </div>
                              <p className="text-muted-foreground text-sm">
                                Réponse moyenne
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 md:p-5 ">
                              <div className="text-2xl lg:text-2xl font-bold text-[#091626] mb-1">
                                5 ans
                              </div>
                              <p className="text-muted-foreground text-sm">
                                Expérience
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-[#091626] text-xl lg:text-[26px] font-semibold mb-1">
                            Avis et témoignages
                          </h2>
                          <p className="text-muted-foreground text-sm lg:text-base mb-4">
                            Ce que disent les clientes et partenaires après avoir travaillé avec elle.
                          </p>
                          <div className="grid grid-cols-12 gap-3 md:gap-4">
                            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                              <div className="bg-white rounded-xl p-5 border border-[#00000008]  flex flex-col h-full">
                                <Quote className="w-9 h-9 text-[#a55b46]/40 mb-2 shrink-0" />
                                <p className="text-[#091626] text-sm italic mb-3 flex-1">
                                  « Prestation très professionnelle et à l&apos;écoute. Les livrables ont dépassé mes attentes. »
                                </p>
                                <div className="flex items-center gap-3 pt-2 border-t border-[#00000008]">
                                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                    <Image
                                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
                                      alt="Marie K."
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[#091626] font-semibold text-sm truncate">Marie K.</p>
                                    <p className="text-muted-foreground text-xs">Entrepreneure</p>
                                  </div>
                                  <div className="flex items-center gap-0.5 ml-auto shrink-0">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-[#a55b46] text-[#a55b46]" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                              <div className="bg-white rounded-xl p-5 border border-[#00000008]  flex flex-col h-full">
                                <Quote className="w-9 h-9 text-[#a55b46]/40 mb-2 shrink-0" />
                                <p className="text-[#091626] text-sm italic mb-3 flex-1">
                                  « Un accompagnement sur-mesure qui m&apos;a aidée à structurer mon activité. Je recommande les yeux fermés. »
                                </p>
                                <div className="flex items-center gap-3 pt-2 border-t border-[#00000008]">
                                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                    <Image
                                      src="https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg"
                                      alt="Sarah M."
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[#091626] font-semibold text-sm truncate">Sarah M.</p>
                                    <p className="text-muted-foreground text-xs">Créatrice d&apos;entreprise</p>
                                  </div>
                                  <div className="flex items-center gap-0.5 ml-auto shrink-0">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-[#a55b46] text-[#a55b46]" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                              <div className="bg-white rounded-xl p-5 border border-[#00000008]  flex flex-col h-full">
                                <Quote className="w-9 h-9 text-[#a55b46]/40 mb-2 shrink-0" />
                                <p className="text-[#091626] text-sm italic mb-3 flex-1">
                                  « Réactive, claire et efficace. Les conseils sont directement applicables. Une experte de confiance. »
                                </p>
                                <div className="flex items-center gap-3 pt-2 border-t border-[#00000008]">
                                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                                    <Image
                                      src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg"
                                      alt="Claire T."
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[#091626] font-semibold text-sm truncate">Claire T.</p>
                                    <p className="text-muted-foreground text-xs">Particulière</p>
                                  </div>
                                  <div className="flex items-center gap-0.5 ml-auto shrink-0">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <Star key={i} className="w-3.5 h-3.5 fill-[#a55b46] text-[#a55b46]" />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h2 className="text-[#091626] text-xl lg:text-[26px] font-semibold mb-1">
                            Comment ça marche
                          </h2>
                          <p className="text-muted-foreground text-sm lg:text-base mb-4">
                            Un processus clair pour avancer sereinement.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            <div className="bg-white rounded-xl p-4 md:p-5 border border-[#00000008] ">
                              <div className="w-8 h-8 rounded-full bg-[#091626] flex items-center justify-center text-white font-bold text-sm mb-3">
                                1
                              </div>
                              <h3 className="text-[#091626] font-semibold text-base mb-2">Brief</h3>
                              <p className="text-muted-foreground text-sm">
                                On clarifie votre besoin, objectifs, références et délais.
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 md:p-5 border border-[#00000008] ">
                              <div className="w-8 h-8 rounded-full bg-[#091626] flex items-center justify-center text-white font-bold text-sm mb-3">
                                2
                              </div>
                              <h3 className="text-[#091626] font-semibold text-base mb-2">Proposition</h3>
                              <p className="text-muted-foreground text-sm">
                                On vous envoie une offre claire + calendrier de livraison.
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 md:p-5 border border-[#00000008] ">
                              <div className="w-8 h-8 rounded-full bg-[#091626] flex items-center justify-center text-white font-bold text-sm mb-3">
                                3
                              </div>
                              <h3 className="text-[#091626] font-semibold text-base mb-2">Production</h3>
                              <p className="text-muted-foreground text-sm">
                                Création, validations rapides, ajustements précis.
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 md:p-5 border border-[#00000008] ">
                              <div className="w-8 h-8 rounded-full bg-[#091626] flex items-center justify-center text-white font-bold text-sm mb-3">
                                4
                              </div>
                              <h3 className="text-[#091626] font-semibold text-base mb-2">Livraison</h3>
                              <p className="text-muted-foreground text-sm">
                                Fichiers finaux + conseils d&apos;utilisation + support.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 "></div>
      </div>
    </div>
  );
};

export default BlockDetailMembre;
