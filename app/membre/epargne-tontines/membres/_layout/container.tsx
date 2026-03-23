"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavBusinnessPlan from '../../_layout/filterNavEpargneTontine';
import TableMembres from './tableMembres';
import CardsWidgets from './cardsWidgets';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useDialog } from '@/context/dialog-context';
import ModalNotification, { modalNotificationDialogName } from '@/components/features/tontines/modalNotification/modalNotificationt';

const Content = () => {
    const { openDialog } = useDialog();
    return (
        <>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6 items-center">
                        <div className="col-span-12 lg:col-span-8">
                            <h1 className="text-[24px] font-semibold text-colorTitle">
                                Membres
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos membres et suivez l&apos;avancement de vos tontines.
                            </p>
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <div className="flex items-center justify-end">
                                <Button
                                    onClick={() => openDialog(modalNotificationDialogName)}
                                    className="bg-primaryColor rounded-lg text-[13px] font-medium text-white hover:bg-primaryColor/90 transition-all duration-300 cursor-pointer h-10 shadow-none gap-2"

                                >
                                    <MessageCircle size={18} />
                                    Message groupé
                                </Button>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <CardsWidgets />
                        </div>
                        <div className="col-span-12">
                            <TableMembres />
                        </div>
                    </div>
                </div>
            </div>
            <ModalNotification />
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
