import React from 'react';
import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import Banner from './banner';
import BlockTemoignage from './blockTemoignage';
import BlockStartMembre from './blockStartMembre';
import BlockFaq from './blockFaq';
import BlockChoice from './blockChoice';
import BlockPrice from './blockPrice';
import BlockLuch from './blockLuch';

const SECTION_IDS = ["MEMBRE__S01", "MEMBRE__S02", "MEMBRE__S03", "MEMBRE__S04", "MEMBRE__S05", "MEMBRE__S06"] as const;

const Container = () => {
    return (
        <AppContainerWebSite>
            <section id={SECTION_IDS[0]}><Banner /></section>
            <section id={SECTION_IDS[1]}><BlockChoice /></section>
            <section id={SECTION_IDS[2]}><BlockPrice /></section>
            <section id={SECTION_IDS[3]}><BlockTemoignage /></section>
            <BlockLuch />
            <section id={SECTION_IDS[4]}><BlockFaq /></section>
            <section id={SECTION_IDS[5]}><BlockStartMembre /></section>
        </AppContainerWebSite>
    );
}

export default Container;
