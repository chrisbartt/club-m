import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAllChroniques from './blockAllChroniques';
import Banner from './banner';
import BlockStartMembre from './blockStartMembre';

const Container = () => {
    return (
        <AppContainerWebSite>
            <Banner/>
            <section id="BLOG__S02"><BlockAllChroniques /></section>
            <BlockStartMembre/>
        </AppContainerWebSite>
    );
}

export default Container;
