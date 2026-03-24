"use client";
import BlockAllEvents from "./blockInfovents";
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import ModalInscription from "@/components/features/modalInscription/modalInscription";
import Banner from "./banner"

type SerializedEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  location: string;
  startDate: string;
  endDate: string;
  capacity: number;
  status: string;
  accessLevel: string;
  prices: { price: number; currency: string; targetRole: string }[];
  ticketsSold: number;
};

const Container = ({ event }: { event?: SerializedEvent }) => {
  return (
    <AppContainerWebSite>
      <Banner event={event} />
      <BlockAllEvents event={event} />
      <ModalInscription />
    </AppContainerWebSite>
  );
};

export default Container;
