import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockContact from './blockContact';

import BannerPage from '@/components/features/bannerPage/bannerPage';

const Container = () => {
    return (
        <AppContainerWebSite>
            <section id="CONTACT__S01"><BannerPage title="Contact" /></section>
            <section id="CONTACT__S02"><BlockContact /></section>
        </AppContainerWebSite>
    );
}

export default Container;
