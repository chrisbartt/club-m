'use client';
import AppContainer from '@/components/common/containers/AppContainer';
import ModalMessage from '../../../../components/features/modalMessage/modalMessage';
import CardAlert from './cardAlert';
import CardsWidgets from './cardsWidgets';
import FilterNavEpargneTontine from './filterNavEpargneTontine';
import CardEvolutionVolume from './cardEvolutionVolume';    
import CardRepartiStatutTontine from './cardRepartiStatutTontine';  
import ActionsRapides from './actionsRapides';
import TableTopTontine from './tableTopTontine';
import TableTopMembre from './tableTopMembre';

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavEpargneTontine />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-semibold text-colorTitle">Vue d&apos;ensemble des épargne tontines</h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos épargne tontines et suivez l&apos;avancement de vos membres.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12">
                            <ActionsRapides />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <CardEvolutionVolume />
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <CardRepartiStatutTontine />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <TableTopTontine />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <TableTopMembre />
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
