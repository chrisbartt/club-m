"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavBusinnessPlan from '../../_layout/filterNavBusinnessPlan';
import CardEvolutionBusinessPlan from './cardEvolutionBusinessPlan';
import CardRepartiStatutBusinessPlan from './cardRepartiStatutBusinessPlan';
import CardsWidgets from './cardsWidgets';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                                Statistiques
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Analysez vos statistiques et suivez les performances de vos business plans.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12 lg:col-span-8">
                            <CardEvolutionBusinessPlan />
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <CardRepartiStatutBusinessPlan />
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
}

export default Container;
