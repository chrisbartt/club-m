"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavMarketPlace from '../../_layout/filterNavMarketPlace';
import TablePaySeq from './tablePaySeq';
import TablePayRecent from './tablePayRecent';
import CardsWidgets from './cardsWidgets';
import PayBloq from './PayBloq';
const Content = () => {
    return (
        <>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavMarketPlace />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12 lg:col-span-8">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                                Paiements et escrow
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Suivi des flux financiers et du séquestre
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <TablePaySeq />
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <PayBloq />
                        </div>
                        <div className="col-span-12">
                            <TablePayRecent />
                        </div>
                        
                    </div>
                </div>
            </div>
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
