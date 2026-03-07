"use client";
import FilterNavMembre from "@/app/admin/membres/filterNavMembre";
import AppContainer from "@/components/common/containers/AppContainer";
import { Button } from "@/components/ui/button";
import { Download, Heart } from "lucide-react";
import ModalCoaching from "../../../../../../components/features/modalCoaching/modalCoaching";
import ModalMessage from "../../../../../../components/features/modalMessage/modalMessage";
import CardActivity from "./cardActivity";
import CardContact from "./cardContact";
import CardHistoAccomp from "./cardHistoAccomp";
import CardNote from "./cardNote";
import CardsWidgets from "./cardsWidgets";
import EtatModul from "./EtatModul";
import Header from "./header";
const Container = () => {
  return (
    <AppContainer>
      <div className="content-page py-3 pt-0 lg:py-4 flex-grow lg:pt-0">
        <FilterNavMembre />
        <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
          <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="md:text-[24px] text-[20px] font-semibold text-colorTitle mt-3 md:mt-0">
                Détail du membre
              </h1>
              <p className="text-colorMuted text-[14px]">
                Voir les informations du membre
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 hidden">
              <div className="hidden md:flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="h-10 px-4 border-colorBorder text-colorTitle dark:bg-bgCard dark:border-colorBorder hover:bg-bgGray gap-2 shadow-none cursor-pointer"
                >
                  <Download size={16} />
                  Exporter
                </Button>
                <Button className="h-10 px-4 bg-bgSidebar dark:bg-bgGray text-white hover:bg-bgSidebar/90 gap-2 shadow-none cursor-pointer">
                  <Heart size={16} />
                  Marquer comme accompagné
                </Button>
              </div>
            </div>
            <div className="col-span-12">
              <Header />
            </div>
            <div className="col-span-12">
              <CardsWidgets />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <div className="flex flex-col gap-3 lg:gap-4">
                <EtatModul />
                <CardHistoAccomp />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="flex flex-col gap-3 lg:gap-4">
                <CardContact />
                <CardActivity />
                <CardNote />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalMessage />
      <ModalCoaching />
    </AppContainer>
  );
};

export default Container;
