/**
 * ChatWindow - Updated to work with backend messages
 */

import React, { useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({ conversation, messages = [], businessPhone, onBack, isMobile, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show welcome screen if no conversation selected
  if (!conversation) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-8 max-w-md">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
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
          backgroundImage: `url("https://i.pinimg.com/originals/d2/a7/76/d2a77609f5d97b9081b117c8f699bd37.jpg")`
        }}
      >
        {/* Messages */}
        <div className="min-h-full">
          {messages.length === 0 ? (
            // No messages state
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <p>No messages yet</p>
                <p className="text-sm">Start a conversation!</p>
              </div>
            </div>
          ) : (
            // Render messages
            messages.map((message) => (
              <MessageBubble
                key={message.id || message.messageId}
                message={message}
                isOutgoing={message.from === businessPhone}
              />
            ))
          )}
          
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