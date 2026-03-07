import React from "react";
import AppContainerWebSite from "@/components/common/containers/AppContainerWebSite";
import BannerPage from "@/components/features/bannerPage/bannerPage";
import BlockParcours from "@/app/parcours/_layout/blockParcoursOne";
import BlockParcoursTow from "@/app/parcours/_layout/blockParcoursTow";
import BlockParcoursThree from "@/app/parcours/_layout/blockParcoursThree";
import BlockStartMembre from "@/app/parcours/_layout/blockStartMembre";
import FixedNavParcous from "@/app/parcours/_layout/fixedNavParcous";

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
