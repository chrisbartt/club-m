'use client';
import AppContainer from '@/components/common/containers/AppContainer';
import ModalMessage from '../../../components/features/modalMessage/modalMessage';
import CardAlert from './cardAlert';
import CardSuiviMembres from './cardSuiviMembres';
import CardsWidgets from './cardsWidgets';
import FilterNavMembre from './filterNavMembre';
import ProgressModules from './progressModules';

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavMembre />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-semibold text-colorTitle">Vue d&apos;ensemble des membres</h1>
                            <p className="text-colorMuted text-[14px]">
                                Pilotez la communauté et identifiez qui a besoin d&apos;accompagnement.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12">
                            <ProgressModules />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <CardSuiviMembres />
                        </div>
                        <div className="col-span-12 lg:col-span-4">
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
