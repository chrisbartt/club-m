import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockAllEvents from './blockAllEvents';
import Banner from './banner';

import BannerPage from '@/components/features/bannerPage/bannerPage';

type EventItem = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  location: string;
  startDate: string;
  endDate: string;
  category: string;
  status: string;
  prices: { price: number; currency: string }[];
};

const Container = ({ events }: { events?: EventItem[] }) => {
    return (
        <AppContainerWebSite>
            <Banner />
            <section id="EVENTS__S01" className="hidden"><BannerPage title="Evenements" /></section>
            <section id="EVENTS__S02"><BlockAllEvents events={events} /></section>
        </AppContainerWebSite>
    );
}

export default Container;
