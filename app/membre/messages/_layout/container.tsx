'use client';

import ChatContainer from './chatContainer';
import ConversationsSidebar from './conversationsSidebar';
import ChatArea from './chatArea';

const Container = () => {
    return (
        <ChatContainer>
            <div className="flex h-screen">
                <ConversationsSidebar />
                <ChatArea />
            </div>
        </ChatContainer>
    );
}

export default Container;
