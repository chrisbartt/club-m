import AppContainerWebSite from '@/components/common/containers/AppContainerWebSite';
import BlockContact from './blockContact';
import Banner from './banner';
import BlockStartMembre from './blockStartMembre';

const Container = () => {
    return (
        <AppContainerWebSite>
            <Banner/>
            <BlockContact />
            <BlockStartMembre/>
        </AppContainerWebSite>
    );
}

export default Container;
