import React from "react";
import AppContainerWebSite from "@/components/common/containers/AppContainerWebSite";
import BannerPage from "@/components/features/bannerPage/bannerPage";
import BlockParcours from "@/app/(site)/parcours/_layout/blockParcoursOne";
import BlockParcoursTow from "@/app/(site)/parcours/_layout/blockParcoursTow";
import BlockParcoursThree from "@/app/(site)/parcours/_layout/blockParcoursThree";
import BlockStartMembre from "@/app/(site)/parcours/_layout/blockStartMembre";
import FixedNavParcous from "@/app/(site)/parcours/_layout/fixedNavParcous";

const Container = () => {
    return (
        <AppContainerWebSite>
            <BannerPage title="Parcours" />
            <FixedNavParcous />
            <BlockParcours />
            <BlockParcoursTow />
            <BlockParcoursThree />
            <BlockStartMembre />
        </AppContainerWebSite>
    );
}

export default Container;
