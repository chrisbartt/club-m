"use client";

import AppContainer from "@/components/common/containers/AppContainer";
import BlockDetailEvent from "./blockDetailEvent";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const Container = () => {
    return (
        <AppContainer>
            <div className="content-page py-3 lg:py-4 grow lg:pt-0">
                <div className="container-fluid w-full px-3 lg:px-4 2xl:px-6 pt-2">
                    <Link
                        href="/admin/evenements"
                        className="inline-flex items-center gap-1 text-[14px] text-colorMuted hover:text-colorTitle mb-4"
                    >
                        <ChevronLeft size={18} />
                        Retour aux événements
                    </Link>
                    <div className="mb-2">
                        <h1 className="text-[24px] font-bold text-colorTitle">Détail de l&apos;événement</h1>
                        <p className="text-colorMuted text-[14px]">Consultez les informations et la gestion des réservations.</p>
                    </div>
                </div>
                <BlockDetailEvent />
            </div>
        </AppContainer>
    );
};

export default Container;
