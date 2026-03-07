"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import ModalMessage from '../../../../../components/features/modalMessage/modalMessage';
import FilterNavMembre from '../../filterNavMembre';
import TableMembre from './tableMembre';

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 pt-0 flex-grow lg:pt-0">
                <FilterNavMembre />
                <div className="container-fluid w-full px-4 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="md:text-[24px] text-[20px] font-semibold text-colorTitle mt-3 md:mt-0">
                                Liste des membres
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Filtrez, identifiez et accompagnez
                            </p>
                        </div>
                        <div className="col-span-12">
                            <TableMembre />
                        </div>
                    </div>
                </div>
            </div>
            <ModalMessage />
        </AppContainer>
    );
}

export default Container;
