import React from 'react'
import { useState } from 'react'
import {conversationsData} from "../data/conversation"
import ChatWindow from '../components/ChatWindow'
import ChatLIst from '../components/ChatLIst'

function ChatPage() {
    const [conversation, setConverstaions] = useState(conversationsData)
    const [selectedId, setSelectedId] = useState(null)

    const handleSentMessage = (text) => {
        setConverstaions(prev => 
            prev.map(conv => 
                conv.id === selectedId
                ? {
                    ...conv,
                    messages: [
                        ...conv.messages,
                        { id: Date.now(), text, status: "sent", time: "Now"}
                    ]
                }
                : conv
            )
        );
    };

    const selectedConversation = conversatios.find(c => c.id === selectedId)

    return (
    <section className="flex h-screen">
      <ChatLIst
        conversations={conversation}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ChatWindow
        conversation={selectedConversation}
        onSendMessage={handleSentMessage}
      />
    </section>
  );
}

export default ChatPage