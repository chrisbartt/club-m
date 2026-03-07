"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavMarketPlace from '../../_layout/filterNavMarketPlace';
import CardsWidgets from './cardsWidgets';
import TableCommissions from './tableCommissions';
const Content = () => {
    return (
        <>
            <div className="content-page py-3 lg:py-4 flex-grow !pt-0">
                <FilterNavMarketPlace />
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12 lg:col-span-8">
                            <h1 className="md:text-[24px] text-[20px] font-bold text-colorTitle mt-3 md:mt-0 leading-tight mb-1">
                            Commissions Club M
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                            Revenus générés par la marketplace
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12">
                            <TableCommissions />
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
