"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import CardsWidgets from './cardsWidgets';
import TableCoachs from './tableCoachs';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow !pt-0">
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6 md:mt-6 mt-4">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="md:text-[24px] text-[20px] font-bold text-colorTitle leading-tight mb-1">
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
