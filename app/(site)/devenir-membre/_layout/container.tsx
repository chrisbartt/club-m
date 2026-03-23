import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import Banner from './banner';
import BlockTemoignage from './blockTemoignage';
import BlockStartMembre from './blockStartMembre';
import BlockFaq from './blockFaq';
import BlockChoice from './blockChoice';
import BlockPrice from './blockPrice';
import BlockLuch from './blockLuch';

const Container = () => {
    return (
        <AppContainerWebSite>
            <Banner />
            <BlockChoice />
            <BlockPrice />
            <BlockTemoignage />
            <BlockLuch />
            <BlockFaq />
            <BlockStartMembre />
        </AppContainerWebSite>
    );
}

export default Container;
