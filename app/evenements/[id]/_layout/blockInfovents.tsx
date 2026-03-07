// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
"use client";
import { useDialog } from "@/context/dialog/contextDialog";
import { useImageModal } from "@/context/imgModalContext/imageModalContext";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Clock, MapPin, UsersRound, Play } from "lucide-react";
import Image from "next/image";

const BlockInfoEvent = () => {
  const { openDialog } = useDialog();
  const { openModal } = useImageModal();
  const hotes = [
    {
      id: 1,
      name: "Maurelle KITEBI",
      company: "Le Club M",
      image: "/images/maurelle.jpeg",
      alt: "maurelle",
    },
  ];

  const intervenantes = [
    {
      id: 1,
      name: "Malu MAKWENGE",
      company: "La maison Hobah",
      image: "/images/malu.jpeg",
      alt: "malu",
    },
    {
      id: 2,
      name: "Faida TRIBUNALI",
      company: "243 Designer",
      image: "/images/faida.jpeg",
      alt: "faida",
    },
    {
      id: 3,
      name: "Anaïa MAMBEKE",
      company: "Fit Brunch",
      image: "/images/anaia.jpeg",
      alt: "anaia",
    },
  ];

  const mcs = [
    {
      id: 1,
      name: "Vanessa TSHIAMALA",
      company: "Thamani",
      image: "/images/vanessa.jpeg",
      alt: "vanessa",
    },
  ];

  const participantes = [
    {
      id: 1,
      name: "Chantal MANGBAU",
      company: "Chémènn Natural Beauty",
      image: "/images/chantal.jpeg",
      alt: "chantal",
    },
    {
      id: 2,
      name: "Michelle MASIMANGO",
      company: "Fit Brunch",
      image: "/images/michelle.jpeg",
      alt: "michelle",
    },
    {
      id: 3,
      name: "Chloé MOHULU",
      company: null,
      image: "/images/chloe.jpeg",
      alt: "chloe",
    },
    {
      id: 4,
      name: "Ornella IZEMENGIA",
      company: null,
      image: "/images/ornella.jpeg",
      alt: "ornella",
    },
    {
      id: 5,
      name: "Emmanuela MBUYI",
      company: "EMK Capillary",
      image: "/images/emmanuela.jpeg",
      alt: "emmanuela",
    },
    {
      id: 6,
      name: "Nadine LONGO",
      company: null,
      image: "/images/nadine.jpeg",
      alt: "nadine",
    },
    {
      id: 7,
      name: "Samantha VANGU",
      company: null,
      image: "/images/samantha.jpeg",
      alt: "samantha",
    },
  ];

  const galleryImages = [
    "/images/banner1.jpg",
    "/images/banner2.png",
    "/images/banner3.jpg",
    "/images/banner4.jpg",
    "/images/banner5.jpg",
    "/images/banner6.jpg",
    "/images/banner7.jpg",
  ];

  const handleImageClick = (imageSrc: string) => {
    openModal(imageSrc, galleryImages);
  };

  return (
    <div className="block-info-event lg:py-[100px] py-[50px] bg-[#f8f8f8] relative z-20 lg:pb-[250px]">
      <div className="container px-4 mx-auto">
        <div className="hidden grid-cols-12 gap-4 lg:gap-10 lg:mb-16 mb-6 mt-[-150px] sm:mt-[-60px] md:mt-[-120px] lg:mt-[-370px] h-full">
          <div className="col-span-1 hidden lg:block 2xl:col-span-2"></div>
          <div className="col-span-12 lg:col-span-10 2xl:col-span-8">
            <div className="flex flex-col lg:gap-10 gap-6">
              <div className="card-video min-h-[200px] sm:min-h-[280px] md:min-h-[340px] rounded-2xl overflow-hidden flex items-center justify-center relative">
                <video
                  src="/videos/3.mp4"
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                />
                <div className="btn-play md:w-20 md:h-20 w-16 h-16 bg-[#a55b46] rounded-full flex items-center justify-center absolute cursor-pointer hover:scale-120 transition-all duration-300">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <div className="flex md:items-center flex-col md:flex-row lg:gap-6 gap-3">
                  <div>
                    <div className="badge border border-[#091626] text-[#091626] md:px-4 md:py-2 px-2 py-1 rounded-full inline-flex items-center gap-1 text-sm md:text-base">
                      <div className="w-3 h-3 bg-[#e1c593] rounded-full "></div>
                      Lunch
                    </div>
                  </div>
                  <div className="date text-muted-foreground md:text-base text-sm">
                    27 décembre 2025
                  </div>
                </div>
                <div className="title text-[#091626] text-xl sm:text-2xl md:text-3xl xl:text-[44px] lg:text-[34px] font-medium md:mt-6 mt-4 leading-[1.1]">
                  Business Women Lunch
                </div>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-xl mt-2">
                  Comment transformer ses abonnés en clients ?
                </p>
                <div className="flex gap-3 lg:gap-6 mt-4 flex-wrap">
                  <div className="flex items-center gap-2 ">
                    <div className="lg:w-8 lg:h-8 w-6 h-6 bg-[#e1e7ee] rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-[#091626]" />
                    </div>
                    <div className="text-[#091626] lg:text-base text-sm">
                      12h - 16h
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="lg:w-8 lg:h-8 w-6 h-6 bg-[#e1e7ee] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-[#091626]" />
                    </div>
                    <div className="text-[#091626] lg:text-base text-sm">
                      La Maison Hobah
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="lg:w-8 lg:h-8 w-6 h-6 bg-[#e1e7ee] rounded-full flex items-center justify-center flex-shrink-0">
                      <UsersRound size={16} className="text-[#091626]" />
                    </div>
                    <div className="text-[#091626] lg:text-base text-sm">
                      35 participantes
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="title text-[#091626] text-lg md:text-xl lg:text-3xl font-medium mb-2 md:mb-0">
                  Description de l&apos;événement
                </div>
                <p className="text-[#091626] opacity-70 text-sm lg:text-[18px] md:mt-2 mt-1 leading-relaxed">
                  L&apos;événement où les femmes entrepreneures se connectent,
                  apprennent et transforment chaque rencontre en opportunité de
                  business. Cet événement est organisé par le Club M, un réseau
                  qui a pour mission de soutenir l&apos;entrepreneuriat féminin.
                </p>
                <p className="text-[#091626] opacity-70 text-sm lg:text-[18px] md:mt-2 mt-1 leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
                  nisi eos, ipsum repellendus ut ducimus assumenda expedita rem
                  aliquam corrupti quae sequi reiciendis praesentium possimus
                  officiis veniam consequuntur sed fuga!
                </p>
              </div>
              
              <div>
                <div className="title text-[#091626] text-lg md:text-xl lg:text-3xl font-medium mb-3 lg:mb-4">
                  Galerie photos
                </div>
                <div className="grid grid-cols-12 gap-3 lg:gap-4">
                  {galleryImages.slice(0, 6).map((imageSrc, index) => {
                    const isLastItem = index === 5;
                    const remainingCount = galleryImages.length - 6;

                    return (
                      <div
                        key={index}
                        className="col-span-6 sm:col-span-4 lg:col-span-4 2xl:col-span-4"
                      >
                        <div
                          className="card rounded-xl relative overflow-hidden group cursor-pointer"
                          onClick={() => handleImageClick(imageSrc)}
                        >
                          <div className="card-img h-[140px] sm:h-[180px] md:h-[220px] lg:h-[250px] relative overflow-hidden rounded-xl">
                            <Image
                              src={imageSrc}
                              alt={`galerie-${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                            />
                            {isLastItem && remainingCount > 0 ? (
                              <div className="overlay absolute top-0 left-0 w-full h-full z-10 bg-[#091626]/30 group-hover:bg-[#091626]/50 transition-all duration-300 flex items-center justify-center">
                                <h4 className="text-[#ffffff] text-xl sm:text-2xl lg:text-4xl font-medium">
                                  +{remainingCount}
                                </h4>
                              </div>
                            ) : (
                              <div className="overlay absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-t from-[#091626]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="title text-[#091626] text-lg md:text-xl lg:text-3xl font-medium mb-3 lg:mb-4">
                  Hôte
                </div>
                <div className="grid grid-cols-12 gap-4">
                  {hotes.map((hote) => (
                    <div
                      key={hote.id}
                      className="col-span-6 lg:col-span-4 2xl:col-span-3"
                    >
                      <div className="card rounded-xl relative overflow-hidden">
                        <div className="card-img min-h-[200px] sm:min-h-[240px] lg:h-[310px] h-[180px] relative overflow-hidden rounded-xl">
                          <Image
                            src={hote.image}
                            alt={hote.alt}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="content-text p-3 md:p-4 absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-end bg-gradient-to-t from-[#091626]/50 to-transparent">
                          <div className="name text-[#ffffff] text-sm md:text-base lg:text-[20px] font-medium mb-1">
                            {hote.name}
                          </div>
                          <div className="text-[#ffffff] opacity-80 lg:text-base text-xs">
                            {hote.company || "Hôte"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="title text-[#091626] lg:text-3xl text-xl font-medium mb-4">
                  Intervenantes
                </div>
                <div className="grid grid-cols-12 gap-4">
                  {intervenantes.map((intervenante) => (
                    <div
                      key={intervenante.id}
                      className="col-span-6 lg:col-span-4 2xl:col-span-3"
                    >
                      <div className="card rounded-xl relative overflow-hidden">
                        <div className="card-img min-h-[200px] sm:min-h-[240px] lg:h-[310px] h-[180px] relative overflow-hidden rounded-xl">
                          <Image
                            src={intervenante.image}
                            alt={intervenante.alt}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="content-text p-3 md:p-4 absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-end bg-gradient-to-t from-[#091626]/50 to-transparent">
                          <div className="name text-[#ffffff] text-sm md:text-base lg:text-[20px] font-medium mb-1">
                            {intervenante.name}
                          </div>
                          <div className="text-[#ffffff] opacity-80 lg:text-base text-xs">
                            {intervenante.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="title text-[#091626] lg:text-3xl text-xl font-medium mb-4">
                  MC
                </div>
                <div className="grid grid-cols-12 gap-4">
                  {mcs.map((mc) => (
                    <div
                      key={mc.id}
                      className="col-span-6 lg:col-span-4 2xl:col-span-3"
                    >
                      <div className="card rounded-xl relative overflow-hidden">
                        <div className="card-img min-h-[200px] sm:min-h-[240px] lg:h-[310px] h-[180px] relative overflow-hidden rounded-xl">
                          <Image
                            src={mc.image}
                            alt={mc.alt}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="content-text p-3 md:p-4 absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-end bg-gradient-to-t from-[#091626]/50 to-transparent">
                          <div className="name text-[#ffffff] text-sm md:text-base lg:text-[20px] font-medium mb-1">
                            {mc.name}
                          </div>
                          <div className="text-[#ffffff] opacity-80 lg:text-base text-xs">
                            {mc.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="title text-[#091626] text-lg md:text-xl lg:text-3xl font-medium mb-3 lg:mb-4">
                  Participantes
                </div>
                <Carousel className="w-full px-2 sm:px-0">
                  <CarouselContent>
                    {participantes.map((participante) => (
                      <CarouselItem
                        key={participante.id}
                        className="basis-full sm:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                      >
                        <div className="card bg-white p-4 md:p-6 lg:p-8 rounded-xl h-full">
                          <div className="card-img h-[80px] w-[80px] sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px] relative overflow-hidden rounded-full mx-auto">
                            <Image
                              src={participante.image}
                              alt={participante.alt}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <div className="content-text p-2 mt-1 text-center">
                            <div className="name text-[#091626] lg:text-[16px] text-sm font-medium">
                              {participante.name}
                            </div>
                            {participante.company && (
                              <div className="text-[#091626] opacity-70 lg:text-sm text-xs">
                                {participante.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-transparent border-none shadow-none -left-4 md:-left-10 cursor-pointer" />
                  <CarouselNext className="bg-transparent border-none shadow-none -right-4 md:-right-10 cursor-pointer" />
                </Carousel>
              </div>
              {/* CTA Réserver visible sur mobile (sidebar ticket masquée) */}
              <div className="lg:hidden mt-6 p-4 rounded-2xl bg-[#091626] text-white">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-[#a55b46] font-medium text-sm">Ticket</p>
                    <p className="text-2xl font-semibold">60 $</p>
                  </div>
                  <Button
                    className="bg-[#a55b46] text-white h-12 hover:bg-[#a55b46]/90 w-full sm:w-auto shrink-0 px-8"
                    onClick={() => openDialog("inscriptionDialog")}
                  >
                    Réserver maintenant
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 hidden lg:block 2xl:col-span-2"></div>
        </div>
        <div className="grid grid-cols-12 gap-4 lg:gap-10 lg:mb-16 mb-6 lg:mt-[-200px] mt-[-100px] h-full">
          <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
            <div className="card bg-white rounded-2xl p-4 lg:p-6 ">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
                  <div className="flex md:items-center flex-col md:flex-row lg:gap-6 gap-3">
                    <div>
                      <div className="badge border border-[#091626] text-[#091626] md:px-4 md:py-2 px-2 py-1 rounded-full inline-flex items-center gap-1 text-sm md:text-base">
                        <div className="w-3 h-3 bg-[#e1c593] rounded-full "></div>
                        Lunch
                      </div>
                    </div>
                    <div className="date text-muted-foreground md:text-base text-sm">
                      27 décembre 2025
                    </div>
                  </div>
                  <div className="title text-[#091626] xl:text-[44px] text-2xl lg:text-[34px] font-medium md:mt-6 mt-4 leading-[100%]">
                    Business Women Lunch
                  </div>
                  <p className="text-muted-foreground lg:text-xl text-base mt-2">
                    Comment transformer ses abonnés en clients ?
                  </p>
                  <div className="flex gap-3 lg:gap-6 mt-4 flex-wrap">
                    <div className="flex items-center gap-2 ">
                      <div className="lg:w-8 lg:h-8 w-6 h-6 bg-[#e1e7ee] rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-[#091626]" />
                      </div>
                      <div className="text-[#091626] lg:text-base text-sm">
                        12h - 16h
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="lg:w-8 lg:h-8 w-6 h-6 bg-[#e1e7ee] rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin size={16} className="text-[#091626]" />
                      </div>
                      <div className="text-[#091626] lg:text-base text-sm">
                        La Maison Hobah
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="lg:w-8 lg:h-8 w-6 h-6 bg-[#e1e7ee] rounded-full flex items-center justify-center flex-shrink-0">
                        <UsersRound size={16} className="text-[#091626]" />
                      </div>
                      <div className="text-[#091626] lg:text-base text-sm">
                        35 participantes
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                  <div className="card h-full border border-dashed p-4 rounded-xl flex flex-col">
                    <p className="text-[#091626] lg:text-base text-sm">
                      Places restantes
                    </p>
                    <p className="text-[#091626] lg:text-base text-sm mt-auto flex items-center gap-1">
                      <span className="text-[#091626] lg:text-4xl text-sm">
                        23
                      </span>
                      <span className="text-[#091626] lg:text-base text-sm opacity-70">
                        / 35
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:gap-6 mt-4 lg:mt-6">
              <div>
                <div className="title text-[#091626] lg:text-3xl text-xl font-medium">
                  Description de l&apos;événement
                </div>
                <p className="text-[#091626] opacity-70 lg:text-[18px] text-sm md:mt-2 mt-1">
                  L&apos;événement où les femmes entrepreneures se connectent,
                  apprennent et transforment chaque rencontre en opportunité de
                  business. Cet événement est organisé par le Club M, un réseau
                  qui a pour mission de soutenir l&apos;entrepreneuriat féminin.
                </p>
                <p className="text-[#091626] opacity-70 lg:text-[18px] text-sm md:mt-2 mt-1">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
                  nisi eos, ipsum repellendus ut ducimus assumenda expedita rem
                  aliquam corrupti quae sequi reiciendis praesentium possimus
                  officiis veniam consequuntur sed fuga!
                </p>
              </div>
              <div>
                <div className="title text-[#091626] text-lg md:text-xl lg:text-3xl font-medium mb-3 lg:mb-4">
                  Hôte
                </div>
                <div className="grid grid-cols-12 gap-3 lg:gap-4">
                  {hotes.map((hote) => (
                    <div
                      key={hote.id}
                      className="col-span-6 lg:col-span-4 2xl:col-span-3"
                    >
                      <div className="card rounded-xl relative overflow-hidden">
                        <div className="card-img sm:min-h-[240px] lg:h-[310px] h-[80px] relative overflow-hidden rounded-xl">
                          <Image
                            src={hote.image}
                            alt={hote.alt}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="content-text p-3 md:p-4 absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-end bg-gradient-to-t from-[#091626]/50 to-transparent">
                          <div className="name text-[#ffffff] text-sm md:text-base lg:text-[20px] font-medium mb-1">
                            {hote.name}
                          </div>
                          <div className="text-[#ffffff] opacity-80 lg:text-base text-xs">
                            {hote.company || "Hôte"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="title text-[#091626] lg:text-3xl text-xl font-medium mb-4">
                  Intervenantes
                </div>
                <div className="grid grid-cols-12 gap-4">
                  {intervenantes.map((intervenante) => (
                    <div
                      key={intervenante.id}
                      className="col-span-6 lg:col-span-4 2xl:col-span-3"
                    >
                      <div className="card rounded-xl relative overflow-hidden">
                        <div className="card-img min-h-[200px] sm:min-h-[240px] lg:h-[310px] h-[180px] relative overflow-hidden rounded-xl">
                          <Image
                            src={intervenante.image}
                            alt={intervenante.alt}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="content-text p-3 md:p-4 absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-end bg-gradient-to-t from-[#091626]/50 to-transparent">
                          <div className="name text-[#ffffff] text-sm md:text-base lg:text-[20px] font-medium mb-1">
                            {intervenante.name}
                          </div>
                          <div className="text-[#ffffff] opacity-80 lg:text-base text-xs">
                            {intervenante.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="title text-[#091626] lg:text-3xl text-xl font-medium mb-4">
                  MC
                </div>
                <div className="grid grid-cols-12 gap-4">
                  {mcs.map((mc) => (
                    <div
                      key={mc.id}
                      className="col-span-6 lg:col-span-4 2xl:col-span-3"
                    >
                      <div className="card rounded-xl relative overflow-hidden">
                        <div className="card-img min-h-[200px] sm:min-h-[240px] lg:h-[310px] h-[180px] relative overflow-hidden rounded-xl">
                          <Image
                            src={mc.image}
                            alt={mc.alt}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="content-text p-3 md:p-4 absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-end bg-gradient-to-t from-[#091626]/50 to-transparent">
                          <div className="name text-[#ffffff] text-sm md:text-base lg:text-[20px] font-medium mb-1">
                            {mc.name}
                          </div>
                          <div className="text-[#ffffff] opacity-80 lg:text-base text-xs">
                            {mc.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="title text-[#091626] lg:text-3xl text-xl font-medium mb-4">
                  Participantes
                </div>
                <Carousel className="w-full">
                  <CarouselContent>
                    {participantes.map((participante) => (
                      <CarouselItem
                        key={participante.id}
                        className="md:basis-1/2 lg:basis-1/3 2xl:basis-1/4"
                      >
                        <div className="card bg-white p-8 rounded-xl h-full">
                          <div className="card-img lg:h-[120px] lg:w-[120px] h-[180px] w-[180px] relative overflow-hidden rounded-full mx-auto">
                            <Image
                              src={participante.image}
                              alt={participante.alt}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <div className="content-text p-2 mt-1 text-center">
                            <div className="name text-[#091626] lg:text-[16px] text-sm font-medium">
                              {participante.name}
                            </div>
                            {participante.company && (
                              <div className="text-[#091626] opacity-70 lg:text-sm text-xs">
                                {participante.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-transparent border-none shadow-none -left-8 cursor-pointer" />
                  <CarouselNext className="bg-transparent border-none shadow-none -right-8 cursor-pointer" />
                </Carousel>
              </div>
              <div>
                <div className="title text-[#091626] text-lg md:text-xl lg:text-3xl font-medium mb-2 md:mb-0">
                 Pourquoi n&apos;est-ce pas à raté cet événement ?
                </div>
                <p className="text-[#091626] opacity-70 text-sm lg:text-[18px] md:mt-2 mt-1 leading-relaxed">
                  L&apos;événement où les femmes entrepreneures se connectent, apprennent et transforment chaque rencontre en opportunité de business. Cet événement est organisé par le Club M, un réseau qui a pour mission de soutenir l&apos;entrepreneuriat féminin.
                </p>
                <Button
                    className="bg-[#a55b46] text-white h-12 hover:bg-[#a55b46] hover:text-white cursor-pointer transition-all duration-300 rounded-lg mt-4"
                    onClick={() => openDialog("inscriptionDialog")}
                  >
                    Réserver maintenant
                  </Button>
              </div>
              <div className="hidden">
                <div className="title text-[#091626] lg:text-3xl text-xl font-medium mb-4">
                  Galerie photos
                </div>
                <div className="grid grid-cols-12 md:gap-4 gap-2">
                  {galleryImages.slice(0, 6).map((imageSrc, index) => {
                    const isLastItem = index === 5;
                    const remainingCount = galleryImages.length - 6;

                    return (
                      <div
                        key={index}
                        className="col-span-6 lg:col-span-4 2xl:col-span-4"
                      >
                        <div
                          className="card rounded-xl relative overflow-hidden group cursor-pointer"
                          onClick={() => handleImageClick(imageSrc)}
                        >
                          <div className="card-img lg:h-[250px] h-[150px] relative overflow-hidden rounded-xl">
                            <Image
                              src={imageSrc}
                              alt={`galerie-${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                            />
                            {isLastItem && remainingCount > 0 ? (
                              <div className="overlay absolute top-0 left-0 w-full h-full z-10 bg-[#091626]/30 group-hover:bg-[#091626]/50 transition-all duration-300 flex items-center justify-center">
                                <h4 className="text-[#ffffff] lg:text-4xl text-2xl font-medium">
                                  +{remainingCount}
                                </h4>
                              </div>
                            ) : (
                              <div className="overlay absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-t from-[#091626]/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
            <div className="flex flex-col gap-4 lg:gap-6 sticky top-[100px] lg:top-[150px]">
              <div className="card bg-[#091626] rounded-2xl p-2 relative z-10">
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 -z-10"
                  style={{
                    backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="content-card  p-4 h-full ">
                  <div className="title text-[#a55b46] text-xl md:text-2xl lg:text-3xl italic font-medium leading-[100%] text-center mb-3 lg:mb-4">
                    Ticket
                  </div>
                  <p className="text-[#ffffff] text-2xl md:text-4xl lg:text-5xl font-semibold mt-1 text-center mb-3 lg:mb-6">
                    60 $
                  </p>
                  <Button
                    className="bg-[#a55b46] text-white h-12 hover:bg-[#a55b46] hover:text-white cursor-pointer transition-all duration-300 rounded-lg w-full mb-4"
                    onClick={() => openDialog("inscriptionDialog")}
                  >
                    Réserver maintenant
                  </Button>
                  <p className="text-[#ffffff] lg:text-sm text-xs mt-1 text-center">
                    Devenez membre et économisez jusqu&apos;à 20% sur les
                    billets d&apos;événements !
                  </p>
                </div>
              </div>
              <div className="card bg-[#e1e7ee] rounded-2xl p-5">
                <div className="title text-[#091626] lg:text-[20px] text-2xl font-medium leading-[100%] mb-2">
                  Business Women Lunch
                </div>
                <p className="text-[#091626] opacity-70 lg:text-base text-sm mt-1">
                  Comment transformer ses abonnés en clients ?
                </p>
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-[#091626]" />
                    <div className="text-[#091626] text-base">12h - 16h</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-[#091626]" />
                    <div className="text-[#091626] text-base">
                      La Maison Hobah
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <UsersRound size={16} className="text-[#091626]" />
                    <div className="text-[#091626] text-base">
                      35 participantes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockInfoEvent;
