// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const BlockContact = () => {
  const [selectedRaison, setSelectedRaison] = useState<string>("");
  return (
    <div className="block-contact lg:py-[100px] py-[50px] bg-[#f5f5f5] lg:pb-[250px]">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-12 lg:gap-6 gap-4">
          <div className="col-span-1 hidden md:block"></div>
          <div className="col-span-12 lg:col-span-10">
            <div className="card bg-white rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-0">
                <div className="col-span-12 lg:col-span-3">
                  <div className="img-contact relative w-full h-[220px] sm:h-[280px] lg:h-full lg:min-h-[400px]">
                    <Image
                      src="/images/banner5.jpg"
                      alt="contact"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-9 p-6 lg:p-10">
                  <div className="text-left">
                    <h4 className="text-xl lg:text-3xl font-medium text-black mb-6 lg:mb-10">
                      <span className="text-[#091626] font-semibold">
                        Bonjour,
                      </span>{" "}
                      ravi de voir que vous avez décidé de nous contacter.
                      Comment pouvons-nous vous aider aujourd’hui?
                    </h4>
                    <div className="grid grid-cols-12 lg:gap-10 gap-6">
                      <div className="col-span-12">
                        <div className="grid grid-cols-12 gap-4 lg:gap-10">
                          <div className="col-span-12 md:col-span-5 lg:col-span-4">
                            <h3 className="text-2xl lg:text-xl font-medium text-black mb-3 relative inline-block pb-3">
                              Quelle est la raison de votre prise de contact ?
                              <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
                            </h3>
                          </div>
                          <div className="col-span-12 md:col-span-7 lg:col-span-8">
                            <div className="flex flex-wrap gap-2">
                              <div className="item-selected relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="raison"
                                  id="raison-projet"
                                  value="projet"
                                  checked={selectedRaison === "projet"}
                                  onChange={(e) =>
                                    setSelectedRaison(e.target.value)
                                  }
                                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                  className={`content-item-selected inline-flex py-3 gap-2 rounded-lg px-6 text-[16px] border duration-300 transition-all ${
                                    selectedRaison === "projet"
                                      ? "border-black  text-black"
                                      : "border-[#0000000f] text-black"
                                  }`}
                                >
                                  Projet
                                </div>
                              </div>
                              <div className="item-selected relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="raison"
                                  id="raison-aide"
                                  value="aide"
                                  checked={selectedRaison === "aide"}
                                  onChange={(e) =>
                                    setSelectedRaison(e.target.value)
                                  }
                                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                  className={`content-item-selected inline-flex py-3 gap-2 rounded-lg px-6 text-[16px] border duration-300 transition-all ${
                                    selectedRaison === "aide"
                                      ? "border-black  text-black"
                                      : "border-[#0000000f] text-black"
                                  }`}
                                >
                                  Besoin d&apos;aide
                                </div>
                              </div>
                              <div className="item-selected relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="raison"
                                  id="raison-question"
                                  value="question"
                                  checked={selectedRaison === "question"}
                                  onChange={(e) =>
                                    setSelectedRaison(e.target.value)
                                  }
                                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                  className={`content-item-selected inline-flex py-3 gap-2 rounded-lg px-6 text-[16px] border duration-300 transition-all ${
                                    selectedRaison === "question"
                                      ? "border-black  text-black"
                                      : "border-[#0000000f] text-black"
                                  }`}
                                >
                                  Question
                                </div>
                              </div>
                              <div className="item-selected relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="raison"
                                  id="raison-suggestion"
                                  value="suggestion"
                                  checked={selectedRaison === "suggestion"}
                                  onChange={(e) =>
                                    setSelectedRaison(e.target.value)
                                  }
                                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                  className={`content-item-selected inline-flex py-3 gap-2 rounded-lg px-6 text-[16px] border duration-300 transition-all ${
                                    selectedRaison === "suggestion"
                                      ? "border-black  text-black"
                                      : "border-[#0000000f] text-black"
                                  }`}
                                >
                                  Suggestion
                                </div>
                              </div>
                              <div className="item-selected relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="raison"
                                  id="raison-autre"
                                  value="autre"
                                  checked={selectedRaison === "autre"}
                                  onChange={(e) =>
                                    setSelectedRaison(e.target.value)
                                  }
                                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div
                                  className={`content-item-selected inline-flex py-3 gap-2 rounded-lg px-6 text-[16px] border duration-300 transition-all ${
                                    selectedRaison === "autre"
                                      ? "border-black  text-black"
                                      : "border-[#0000000f] text-black"
                                  }`}
                                >
                                  Autre
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-12">
                        <div className="grid grid-cols-12 gap-4 lg:gap-10">
                          <div className="col-span-12 md:col-span-5 lg:col-span-4">
                            <h3 className="text-2xl lg:text-xl font-medium text-black mb-3 relative inline-block pb-3">
                              Dites nous en plus à propos de vous et de vos
                              besoins
                              <span className="absolute bottom-0 left-0 w-[25%] h-[3px] bg-[#a55b46]"></span>
                            </h3>
                          </div>
                          <div className="col-span-12 md:col-span-7 lg:col-span-8">
                            <div className="flex flex-col gap-4">
                              <div>
                                <Input
                                  type="text"
                                  id="prenom"
                                  name="prenom"
                                  className={`shadow-none h-[52px] lg:text-[16px]  focus-visible:ring-0 focus-visible:border-black rounded-lg`}
                                  required
                                  placeholder="Votre prénom"
                                />
                              </div>
                              <div>
                                <Input
                                  type="text"
                                  id="nom"
                                  name="nom"
                                  className={`shadow-none h-[52px] lg:text-[16px] focus-visible:ring-0 focus-visible:border-black rounded-lg`}
                                  required
                                  placeholder="Votre nom de famille"
                                />
                              </div>
                              <div>
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
                                <Input
                                  type="text"
                                  id="telephone"
                                  name="telephone"
                                  className={`shadow-none h-[52px] lg:text-[16px]  focus-visible:ring-0 focus-visible:border-black rounded-lg`}
                                  required
                                  placeholder="Votre numéro de téléphone"
                                />
                              </div>
                              <div>
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
                                <Button className="bg-[#a55b46] text-white h-12 hover:bg-[#a55b46]/80 hover:text-white cursor-pointer transition-all duration-300 rounded-lg">
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
            </div>
            <div className="grid grid-cols-12 gap-4 lg:gap-6 lg:mt-10">
              <div className="col-span-12 md:col-span-6">
                <div className="text-center">
                  <p className="text-base lg:text-xl text-muted-foreground mb-2">
                    Appelez-nous
                  </p>
                  <Link
                    href="tel:+243997000000"
                    className="text-xl lg:text-3xl font-medium text-black mb-6 lg:mb-10"
                  >
                    +243 997 000 000
                  </Link>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="text-center">
                  <p className="text-base lg:text-xl text-muted-foreground mb-2">
                    Ecrivez-nous
                  </p>
                  <Link
                    href="mailto:info@clubm.com"
                    className="text-xl lg:text-3xl font-medium text-black mb-6 lg:mb-10"
                  >
                    info@clubm.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
};

export default BlockContact;
