import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BannerPage from '@/components/features/bannerPage/bannerPage';
import BlockParcours from './blockParcoursOne';
import BlockParcoursTow from './blockParcoursTow';
import BlockParcoursThree from './blockParcoursThree';
import BlockStartMembre from './blockStartMembre';
import FixedNavParcous from './fixedNavParcous';

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
