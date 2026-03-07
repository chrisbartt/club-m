'use client';
import AppContainer from "@/components/common/containers/AppContainer";
import FilterNavMarketPlace from "./filterNavMarketPlace";
import StatutCommand from "./statutCommand";
import TableCommande from "./tableCommande";
import TopPrestataires from "./topPrestataires";
import CardAlert from "./cardAlert";
import CardsWidgets from "./cardsWidgets";

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow !pt-0">
                <FilterNavMarketPlace />
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-4">
                        <div className="col-span-12">
                            <h1 className="md:text-[24px] text-[20px] font-semibold text-colorTitle mt-3 md:mt-0 leading-tight mb-1">Dashboard Marketplace</h1>
                            <p className="text-colorMuted text-[14px]">
                                Vue d&apos;ensemble de l&apos;activité économique de l&apos;annuaire Club M.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <CardAlert />
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <StatutCommand />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <TableCommande />
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <TopPrestataires />
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
}

export default Container;
