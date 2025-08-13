/**
 * Sidebar - WhatsApp Web identical styling
 */
import React from "react";
import Avatar from "./Avatar";
import { IoSearch, IoEllipsisVertical } from "react-icons/io5";
import { formatListTime } from "../utils/time";

const SideBar = ({ conversations, activeId, onSelect, searchTerm, setSearchTerm, businessPhone }) => {
  return (
    <aside className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-green-600">WhatsApp</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <IoEllipsisVertical className="w-6 h-6 cursor-pointer hover:text-gray-800" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 bg-white border-b border-gray-100">
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-white border-b border-gray-100 px-3 py-2">
        <button className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mr-2">
          All
        </button>
        <button className="text-gray-600 px-3 py-1 text-sm hover:text-gray-800">
          Unread
        </button>
        <button className="text-gray-600 px-3 py-1 text-sm hover:text-gray-800">
          Favorites
        </button>
        <button className="text-gray-600 px-3 py-1 text-sm hover:text-gray-800">
          Groups
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No conversations found</p>
          </div>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => onSelect(conversation)}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                activeId === conversation.id ? 'bg-gray-100' : 'bg-white'
              }`}
            >
              <Avatar text={conversation.contact.avatar || conversation.contact.name} size={12} />
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900 truncate">
                    {conversation.contact.name}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatListTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {conversation.lastMessage || 'No messages yet'}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default SideBar;