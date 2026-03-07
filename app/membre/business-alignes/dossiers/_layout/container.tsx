"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import ShowDetail from '@/components/features/business-plans/showDetail/showDetail';
import ModalCoaching from '../../../../../components/features/modalCoaching/modalCoaching';
import ModalMessage from '../../../../../components/features/modalMessage/modalMessage';
import FilterNavBusinnessPlan from '../../_layout/filterNavBusinnessPlan';
import TableDossiers from './tableDossiers';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                                Liste des business plans
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos business plans et suivez l&apos;avancement de vos clients.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <TableDossiers />
                        </div>
                    </div>
                </div>
            </div>
            <ModalMessage />
            <ShowDetail />
            <ModalCoaching />
        </AppContainer>
    );
}

export default Container;
