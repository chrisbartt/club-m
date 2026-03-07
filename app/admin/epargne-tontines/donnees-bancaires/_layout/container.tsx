"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavBusinnessPlan from '../../_layout/filterNavEpargneTontine'; 
import CardsWidgets from './cardsWidgets';
import CardUploadFile from './cardUploadFile';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                                Données bancaires
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos données bancaires et suivez leurs activités bancaires.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12">
                            <CardUploadFile />
                        </div>
                    </div>
                </div>
            </div>
            
        </AppContainer>
    );
}

export default Container;
