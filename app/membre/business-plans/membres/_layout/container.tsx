"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavBusinnessPlan from '../../_layout/filterNavBusinnessPlan';
import TableMembres from './tableMembres';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-semibold text-colorTitle">
                                Liste des membres
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos membres et suivez l&apos;avancement de vos business plans.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <TableMembres />
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
}

export default Container;
