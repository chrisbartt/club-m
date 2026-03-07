"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavMarketPlace from '../../_layout/filterNavMarketPlace';
import TabsAlertes from './tabsAlertes';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Content = () => {
    return (
        <>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavMarketPlace />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12 lg:col-span-8">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                                Alertes et Notifications
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Centre de notification en temps réel
                            </p>
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <div className="flex items-center justify-end">
                                <Button className="bg-transparent border border-colorTitle rounded-lg text-[13px] font-medium text-colorTitle hover:bg-colorTitle/10 transition-all duration-300 cursor-pointer h-10 shadow-none gap-2">
                                    <Check size={16} className="text-colorTitle" />
                                    Tout masquer comme lus
                                </Button>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <TabsAlertes />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
const Container = () => {
    return (
        <AppContainer>
            <Content />
        </AppContainer>
    );
}

export default Container;
