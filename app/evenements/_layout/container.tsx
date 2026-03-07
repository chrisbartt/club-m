import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAllEvents from './blockAllEvents';

import BannerPage from '@/components/features/bannerPage/bannerPage';

const Container = () => {
    return (
        <AppContainerWebSite>
            <section id="EVENTS__S01"><BannerPage title="Evenements" /></section>
            <section id="EVENTS__S02"><BlockAllEvents /></section>
        </AppContainerWebSite>
    );
}

export default Container;
