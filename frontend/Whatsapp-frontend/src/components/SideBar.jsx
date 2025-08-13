/**
 * Sidebar - Fixed with proper scrolling for chat list
 */

import React from "react";
import Avatar from "./Avatar";
import { IoSearch, IoEllipsisVertical } from "react-icons/io5";
import { formatListTime } from "../utils/time";

const Sidebar = ({ conversations, activeId, onSelect, searchTerm, setSearchTerm, businessPhone }) => {
  return (
    // Fixed: Full height sidebar with proper structure
    <aside className="h-screen flex flex-col bg-gray-50 border-r border-gray-200">
      
      {/* Header - Fixed height */}
      <header className="flex-shrink-0 p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Avatar text="Business" size={12} />
          <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <IoEllipsisVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none text-sm placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-green-500"
          />
        </div>
      </header>

      {/* Chat List - Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>{searchTerm ? 'No chats found' : 'No conversations yet'}</p>
          </div>
        ) : (
          conversations.map(conv => {
            const isActive = conv.id === activeId;
            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`
                  flex items-center p-4 cursor-pointer border-b border-gray-100 
                  hover:bg-gray-50 transition-colors
                  ${isActive ? 'bg-blue-50 border-blue-100' : ''}
                `}
              >
                <Avatar text={conv.contact.name} size={12} />
                
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conv.contact.name}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatListTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default Sidebar;