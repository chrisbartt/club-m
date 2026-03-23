import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAllEvents from './blockAllEvents';
import Banner from './banner';

import BannerPage from '@/components/features/bannerPage/bannerPage';

const Container = () => {
    return (
        <AppContainerWebSite>
            <Banner />
            <section id="EVENTS__S01" className="hidden"><BannerPage title="Evenements" /></section>
            <section id="EVENTS__S02"><BlockAllEvents /></section>
        </AppContainerWebSite>
    );
}

export default Container;
