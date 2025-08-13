/**
 * ChatHeader - Header for individual chat conversations
 */

import React from 'react';
import Avatar from './Avatar';
import { IoArrowBack, IoSearch, IoEllipsisVertical } from 'react-icons/io5';

const ChatHeader = ({ conversation, onBack, isMobile }) => {
  if (!conversation) return null;

  return (
    <header className="flex-shrink-0 bg-gray-100 border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        
        {/* Left section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          
          {/* Back button for mobile */}
          {isMobile && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <IoArrowBack className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Contact avatar */}
          <Avatar text={conversation.contact.name} size={8} />

          {/* Contact info */}
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-900 text-base truncate">
              {conversation.contact.name}
            </h1>
            <p className="text-sm text-gray-500">online</p>
          </div>
        </div>

        {/* Right section - Action buttons */}
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <IoSearch className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <IoEllipsisVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;