"use client";
import AppContainer from "@/components/common/containers/AppContainer";
import ModalAddTontine, { addTontineDialogName } from "@/components/features/tontines/modalAddTontine/modalAddTontine";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/context/dialog-context";
import { Plus } from "lucide-react";
import FilterNavBusinnessPlan from "../../_layout/filterNavEpargneTontine";
import TableTontines from "./tableTontines";
const Content = () => {
    const { openDialog } = useDialog();
    return (
        <>
            <div className="content-page py-3 lg:py-4 flex-grow lg:pt-0">
                <FilterNavBusinnessPlan />
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6">
                    <div className="grid grid-cols-12 gap-3 lg:gap-4 lg:mt-6 items-center">
                        <div className="col-span-12 lg:col-span-8">
                            <h1 className="text-[24px] font-bold text-colorTitle">
                                Toutes les tontines
                            </h1>
                            <p className="text-colorMuted text-[14px]">
                                Gérez vos tontines et suivez l&apos;avancement de vos membres.
                            </p>
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <div className="flex items-center justify-end">
                                <Button
                                    onClick={() => openDialog(addTontineDialogName)}
                                    className="bg-primaryColor rounded-lg text-[13px] font-medium text-white hover:bg-primaryColor/90 transition-all duration-300 cursor-pointer h-10 shadow-none gap-2"
                                >
                                    <Plus size={18} />
                                    Ajouter une tontine
                                </Button>
                            </div>
                        </div>
                        <div className="col-span-12">
                            <TableTontines />
                        </div>
                    </div>
                </div>
            </div>
            <ModalAddTontine />
        </>
    )
}
const Container = () => {


    return (
        <AppContainer>
            <Content />
        </AppContainer>
    );
};

export default Container;
