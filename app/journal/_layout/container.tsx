import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAllChroniques from './blockAllChroniques';

import BannerPage from '@/components/features/bannerPage/bannerPage';

const Container = () => {
    return (
        <AppContainerWebSite>
            <section id="BLOG__S01"><BannerPage title="Journal" /></section>
            <section id="BLOG__S02"><BlockAllChroniques /></section>
        </AppContainerWebSite>
    );
}

export default Container;
