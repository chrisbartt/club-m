'use client';
import AppContainer from "@/components/common/containers/AppContainer";
import DashboardHeader from "./dashboardHeader";
import CardsWidgets from "./cardsWidgets";
import SidebarWidgets from "./sidebarWidgets";
const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 grow lg:pt-0">
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    {/* Header avec salutation et KPIs */}
                    <DashboardHeader />
                
                    {/* Contenu principal */}
                    <div className="grid grid-cols-12 gap-3 lg:gap-4">
                        {/* Colonne principale - Cartes de modules */}
                        <div className="col-span-12 lg:col-span-8">
                            <CardsWidgets />
                        </div>
                        
                        {/* Colonne latérale - Événements et Activité */}
                        <div className="col-span-12 lg:col-span-4">
                            <SidebarWidgets />
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
}

export default Container;
