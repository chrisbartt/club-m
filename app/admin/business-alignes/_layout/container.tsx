'use client';
import AppContainer from '@/components/common/containers/AppContainer';
import ModalMessage from '../../../../components/features/modalMessage/modalMessage';
import CardAcces from './cardAcces';
import CardAlert from './cardAlert';
import CardDossiers from './cardDossiers';
import CardsWidgets from './cardsWidgets';
import FilterNavBusinnessPlan from './filterNavBusinnessPlan';

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 pt-0 flex-grow lg:pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="md:text-[24px] text-[20px] font-semibold text-colorTitle mt-3 md:mt-0 leading-tight mb-1">Vue d&apos;ensemble des business alignés</h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos business alignés et suivez l&apos;avancement de vos clients.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <CardDossiers />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <CardAcces />
                        </div>
                        <div className="col-span-12">
                            <CardAlert />
                        </div>
                    </div>
                </div>
            </div>
            <ModalMessage />
        </AppContainer>
    );
}

export default Container;
