'use client';
import AppContainer from '@/components/common/containers/AppContainer';
import ModalMessage from '../../../../components/features/modalMessage/modalMessage';
import BusinessAligneHeader from './businessAligneHeader';
import SummaryCards from './summaryCards';
import EtapesParcours from './etapesParcours';
import VisionObjectifs from './visionObjectifs';
import RecapitulatifDossier from './recapitulatifDossier';
import SidebarBusinessAligne from './sidebarBusinessAligne';

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 grow !pt-0">
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    {/* Header avec bannière */}
                    <BusinessAligneHeader />
                    
                    {/* Cartes de résumé */}
                    <div className="md:mb-4 mb-3">
                        <SummaryCards />
                    </div>

                    {/* Contenu principal */}
                    <div className="grid grid-cols-12 gap-3 lg:gap-4">
                        {/* Colonne principale */}
                        <div className="col-span-12 lg:col-span-8">
                            <div className="space-y-3 md:space-y-4">
                                <EtapesParcours />
                                <VisionObjectifs />
                                <RecapitulatifDossier />
                            </div>
                        </div>
                        
                        {/* Sidebar */}
                        <div className="col-span-12 lg:col-span-4">
                            <SidebarBusinessAligne />
                        </div>
                    </div>
                </div>
            </div>
            <ModalMessage />
        </AppContainer>
    );
}

export default Container;
