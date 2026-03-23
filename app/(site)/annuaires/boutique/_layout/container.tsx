'use client';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import Banner from './banner';
import BlockDescription from './blockDescription';
import BlockAvisClients from './blockAvisClients';

const Container = () => {
    return (
        <AppContainerWebSite>
            <Banner />
            <BlockDescription />
            <BlockAvisClients />
        </AppContainerWebSite>
    );
}

export default Container;
