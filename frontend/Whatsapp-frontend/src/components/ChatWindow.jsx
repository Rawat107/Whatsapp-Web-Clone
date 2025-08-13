/**
 * ChatWindow - Fixed with proper message area scrolling
 */

import React, { useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({ conversation, businessPhone, onBack, isMobile, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  // Show welcome screen if no conversation selected
  if (!conversation) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-8 max-w-md">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-bold">W</span>
            </div>
          </div>
          <h1 className="text-3xl font-light text-gray-800 mb-6">
            WhatsApp Web
          </h1>
          <div className="space-y-3 text-gray-600">
            <p>Send and receive messages without keeping your phone online.</p>
            <p>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Fixed: Full height chat window with proper flex structure
    <div className="h-screen flex flex-col bg-white">
      
      {/* Header - Fixed height */}
      <ChatHeader 
        conversation={conversation} 
        onBack={onBack} 
        isMobile={isMobile} 
      />

      {/* Messages Area - Scrollable with WhatsApp background */}
      <div 
        className="flex-1 overflow-y-auto py-4"
        style={{
          backgroundColor: '#efeae2',
          backgroundImage: `url("https://th.bing.com/th/id/OIP.Z4exQUwGyO5mhBDN8AT4lgHaPZ?w=182&h=372&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3")`
        }}
      >
        {/* Messages */}
        <div className="min-h-full">
          {conversation.messages?.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOutgoing={message.from === businessPhone}
            />
          ))}
          
          {/* Invisible scroll target */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Message Input - Fixed height */}
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

export default ChatWindow;