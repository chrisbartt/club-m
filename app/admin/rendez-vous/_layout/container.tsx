"use client";
import AppContainer from "@/components/common/containers/AppContainer";
import CardsWidgets from "./cardsWidgets";
import TableRendezVous from "./tableRendezVous";

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6 mt-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                                Rendez-vous
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Consultez et gérez tous les rendez-vous des membres avec les coachs.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12">
                            <TableRendezVous />
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
};

export default Container;
