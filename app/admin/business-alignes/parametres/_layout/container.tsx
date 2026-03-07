"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavBusinnessPlan from '../../_layout/filterNavBusinnessPlan';
import CardConfigBp from './cardConfigBp';
import CardConfigNotif from './cardConfigNotif';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="md:text-[24px] text-[20px] font-bold text-colorTitle mt-3 md:mt-0 leading-tight mb-1">
                                Paramètres
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Configurez vos paramètres et suivez l&apos;avancement de vos business plans.
                            </p>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <CardConfigBp />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <CardConfigNotif />
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
}

export default Container;
