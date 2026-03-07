"use client";
import AppContainer from "@/components/common/containers/AppContainer";
import FilterDashboard from "./filterDashboard";
import CardsWidgets from "./cardsWidgets";
import TableNewDamande from "./tableNewDamande";
import EtatModul from "./EtatModul";
import TableMembre from "./tableMembre";
import CartAtelierCoaching from "./cartAtelierCoaching";
const Container = () => {
  return (
    <AppContainer>
      <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
        <FilterDashboard />
        <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
          <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
            <div className="col-span-12">
              <h1 className="md:text-[24px] text-[20px] font-semibold text-colorTitle">
                Vue d&apos;ensemble
              </h1>
              <p className="text-colorMuted text-[14px]">
                Pilotez la communauté et identifiez qui a besoin
                d&apos;accompagnement.
              </p>
            </div>
            <div className="col-span-12">
              <CardsWidgets />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <TableNewDamande />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <EtatModul />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <TableMembre />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <CartAtelierCoaching />
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};

export default Container;
