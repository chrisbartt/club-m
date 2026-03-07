"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavMarketPlace from '../../_layout/filterNavMarketPlace';
import CardConfigGenerale from './cardConfigGenerale';
import CardConfigNotif from './cardConfigNotif';
import CardCategorie from './cardCategorie';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavMarketPlace />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                            Paramètres Marketplace
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                            Configuration du module marketplace
                            </p>
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <CardConfigGenerale />
                        </div>
                        <div className="col-span-12 lg:col-span-6">
                            <CardCategorie />
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
