/**
 * ChatPage - Fixed for proper full screen layout and scrolling
 */

import React, { useEffect, useState, useRef } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/SideBar";
import { conversationsData } from "../data/conversations.js";
import { createSocket } from "../utils/socket.js";

const ChatPage = () => {
  // State management
  const [conversations, setConversations] = useState(() => 
    JSON.parse(JSON.stringify(conversationsData.conversations))
  );
  const businessPhone = conversationsData.businessPhone;
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const socketRef = useRef(null);

  // Socket setup
  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    if (!socket) return;

    socket.on("connect", () => {
      console.log('Socket connected');
    });

    socket.on("new-message", (payload) => {
      const { conversationId, message } = payload;
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, message],
                lastMessage: message.text,
                lastMessageTime: message.timestamp
              }
            : conv
        )
      );
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Responsive behavior
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Select conversation
  const selectConversation = (conv) => {
    setSelectedConversation(conv);
    setShowSidebar(false);

    // Clear unread count
    setConversations(prev => prev.map(c => 
      c.id === conv.id ? { ...c, unreadCount: 0 } : c
    ));

    // Join socket room
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("join-conversation", conv.id);
    }
  };

  const goBack = () => {
    setSelectedConversation(null);
    setShowSidebar(true);
    if (socketRef.current && socketRef.current.connected && selectedConversation) {
      socketRef.current.emit("leave-conversation", selectedConversation.id);
    }
  };

  // Send message
  const sendMessage = (text) => {
    if (!selectedConversation || !text.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      from: businessPhone,
      to: selectedConversation.contact.phone,
      text,
      timestamp: Date.now().toString(),
      type: "outgoing",
      status: "sent"
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: text,
          lastMessageTime: newMessage.timestamp
        };
      }
      return conv;
    }));

    // Socket emit
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("send-message", { 
        conversationId: selectedConversation.id, 
        message: newMessage 
      });
    }

    // Status updates
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: conv.messages.map(m => 
              m.id === newMessage.id ? { ...m, status: "delivered" } : m
            )
          };
        }
        return conv;
      }));
    }, 1000);

    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: conv.messages.map(m => 
              m.id === newMessage.id ? { ...m, status: "read" } : m
            )
          };
        }
        return conv;
      }));
    }, 3000);
  };

  // Keep selected conversation in sync
  useEffect(() => {
    if (!selectedConversation) return;
    const fresh = conversations.find(c => c.id === selectedConversation.id);
    if (fresh) setSelectedConversation(fresh);
  }, [conversations, selectedConversation]);

  // Filter conversations
  const filtered = conversations.filter(c =>
    c.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Fixed: Full height container with no scrolling at this level
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      
      {/* Sidebar */}
      <div className={`
        ${isMobile && !showSidebar ? 'hidden' : 'block'} 
        ${isMobile ? 'w-full' : 'w-80'} 
        flex-shrink-0
      `}>
        <Sidebar
          conversations={filtered}
          activeId={selectedConversation?.id}
          onSelect={selectConversation}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          businessPhone={businessPhone}
        />
      </div>

      {/* Chat Window */}
      <div className={`
        flex-1 
        ${isMobile && showSidebar ? 'hidden' : 'flex'}
        flex-col
      `}>
        <ChatWindow
          conversation={selectedConversation}
          businessPhone={businessPhone}
          onBack={goBack}
          isMobile={isMobile}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;