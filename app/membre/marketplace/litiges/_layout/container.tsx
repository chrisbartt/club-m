"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavMarketPlace from '../../_layout/filterNavMarketPlace';
import TableLitigeEncours from './tableLitigeEncours';
import TableLitigeResolus from './tableLitigeResolus';
import ShowLitige from '@/components/features/marketplace/showLitige/showLitige';
import CardsWidgets from './cardsWidgets';
const Content = () => {
    return (
        <>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavMarketPlace />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6 items-center">
                        <div className="col-span-12 lg:col-span-8">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                            Centre des Litiges
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                            Arbitrage et résolution des conflits
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12">
                            <TableLitigeEncours />
                        </div>
                        <div className="col-span-12">
                            <TableLitigeResolus />
                        </div>
                    </div>
                </div>
            </div>
            <ShowLitige />
        </>
    );
};
const Container = () => {
    return (
        <AppContainer>
            <Content />
        </AppContainer>
    );
}

export default Container;
