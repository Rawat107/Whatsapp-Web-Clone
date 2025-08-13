/**
 * ChatHeader - Header for individual chat conversations with close chat option
 */
import React, { useState } from 'react';
import Avatar from './Avatar';
import { IoArrowBack, IoSearch, IoEllipsisVertical } from 'react-icons/io5';

const ChatHeader = ({ conversation, onBack, isMobile, onCloseChat }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!conversation) return null;

  const handleCloseChat = () => {
    setShowMenu(false);
    onCloseChat();
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <button 
            onClick={onBack} 
            className="mr-3 p-1 text-gray-600 hover:text-gray-800"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
        )}
        <Avatar text={conversation.contact.avatar || conversation.contact.name} size={10} />
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">
            {conversation.contact.name}
          </h3>
          <p className="text-sm text-gray-500">
            Online
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 text-gray-600">
        <IoSearch className="w-5 h-5 cursor-pointer hover:text-gray-800" />
        <div className="relative">
          <IoEllipsisVertical 
            className="w-5 h-5 cursor-pointer hover:text-gray-800" 
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-32">
              <button
                onClick={handleCloseChat}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Close chat
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay to close menu when clicking outside */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;