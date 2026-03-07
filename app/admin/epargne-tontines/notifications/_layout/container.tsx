"use client";
import AppContainer from '@/components/common/containers/AppContainer';
import FilterNavBusinnessPlan from '../../_layout/filterNavEpargneTontine';
import TableDemandes from './tableNotifications';
import ActionsRapides from './actionsRapides';
import ModalNotification from '@/components/features/tontines/modalNotification/modalNotificationt';
import ModalRappelPay from '@/components/features/tontines/modalRappelPay/modalRappelPay';


const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6">
                        <div className="col-span-12">
                            <h1 className="text-[24px] font-semibold text-colorTitle">
                                Notifications
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos notifications et suivez leurs activités.
                            </p>
                        </div>
                        <div className="col-span-12">
                            <ActionsRapides />
                        </div>
                        <div className="col-span-12">
                            <TableDemandes />
                        </div>
                    </div>
                </div>
            </div>
            <ModalNotification />
            <ModalRappelPay />
        </AppContainer>
    );
}

export default Container;
