'use client';
import AppContainer from "@/components/common/containers/AppContainer";
import FilterNavMarketPlace from "./filterNavMarketPlace";
import MemberCardsWidgets from "./memberCardsWidgets";
import MesOffres from "./mesOffres";
import MesCommandes from "./mesCommandes";

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 grow !pt-0">
                <FilterNavMarketPlace />
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-4">
                        {/* Header */}
                        <div className="col-span-12">
                            <h1 className="md:text-[24px] text-[20px] font-semibold text-colorTitle mt-3 md:mt-0">Ma Marketplace</h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos offres et suivez vos ventes sur la marketplace Club M.
                            </p>
                        </div>

                        {/* Statistiques */}
                        <div className="col-span-12">
                            <MemberCardsWidgets />
                        </div>

                        {/* Mes offres */}
                        <div className="col-span-12 lg:col-span-8">
                            <MesOffres />
                        </div>

                        {/* Mes commandes récentes */}
                        <div className="col-span-12 lg:col-span-4">
                            <MesCommandes />
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
}

export default Container;
