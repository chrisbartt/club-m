"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavBusinnessPlan from '../../_layout/filterNavBusinnessPlan';
import CardsWidgets from './cardsWidgets';
import TableCoachs from './tableCoachs';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 mt-0 flex-grow pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="md:text-[24px] text-[20px] font-bold text-colorTitle mt-3 md:mt-0 leading-tight mb-1">
                                Coachs
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos coachs et suivez leurs activités.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12">
                            <TableCoachs />
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
}

export default Container;
