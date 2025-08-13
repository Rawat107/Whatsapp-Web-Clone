import React, { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import { apiService } from "../utils/apiService";

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const businessPhone = "918329446654";

  // Load conversations from backend
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await apiService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await apiService.getMessages(conversationId);
      
      // Set all existing outgoing messages to "read" status (blue ticks)
      const messagesWithReadStatus = data.map(msg => {
        if (msg.type === 'outgoing') {
          return { ...msg, status: 'read' };
        }
        return msg;
      });
      
      setMessages(messagesWithReadStatus);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
    
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Helper function to update message status
  const updateMessageStatus = (messageId, newStatus) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: newStatus } : msg
    ));
  };

  // Helper function to move conversation to top
  const moveConversationToTop = (conversationId, newMessage) => {
    setConversations(prev => {
      const conversationIndex = prev.findIndex(conv => conv.id === conversationId);
      if (conversationIndex === -1) return prev;

      const updatedConversation = {
        ...prev[conversationIndex],
        lastMessage: newMessage.text,
        lastMessageTime: newMessage.timestamp
      };

      // Remove conversation from current position and add to top
      const newConversations = [...prev];
      newConversations.splice(conversationIndex, 1);
      newConversations.unshift(updatedConversation);

      return newConversations;
    });
  };

  const sendMessage = async (text) => {
    if (!selectedConversation || !text.trim()) return;

    try {
      const newMessage = await apiService.sendMessage(selectedConversation.id, text.trim());
      setMessages(prev => [...prev, newMessage]);
      
      // Move conversation to top with animation
      moveConversationToTop(selectedConversation.id, newMessage);

      // Only animate status for NEW messages
      // Update to "delivered" after 1 second
      setTimeout(() => {
        updateMessageStatus(newMessage.id, 'delivered');
      }, 1000);

      // Update to "read" after 3 seconds
      setTimeout(() => {
        updateMessageStatus(newMessage.id, 'read');
      }, 3000);

    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleCloseChat = () => {
    setSelectedConversation(null);
    setMessages([]);
    if (isMobile) {
      setShowSidebar(true);
    }
  };

  const goBack = () => {
    setSelectedConversation(null);
    setMessages([]);
    setShowSidebar(true);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setShowSidebar(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      <div className={`
        ${isMobile && !showSidebar ? 'hidden' : 'block'} 
        ${isMobile ? 'w-full' : 'w-80'} 
        flex-shrink-0 transition-all duration-300 ease-in-out
      `}>
        <Sidebar
          conversations={filteredConversations}
          activeId={selectedConversation?.id}
          onSelect={selectConversation}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          businessPhone={businessPhone}
        />
      </div>

      <div className={`
        flex-1 
        ${isMobile && showSidebar ? 'hidden' : 'flex'}
        flex-col transition-all duration-300 ease-in-out
      `}>
        <ChatWindow
          conversation={selectedConversation}
          messages={messages}
          businessPhone={businessPhone}
          onBack={goBack}
          isMobile={isMobile}
          onSendMessage={sendMessage}
          onCloseChat={handleCloseChat}
        />
      </div>
    </div>
  );
};

export default ChatPage;