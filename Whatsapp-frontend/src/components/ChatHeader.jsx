import React, { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import { IoArrowBack, IoSearch, IoEllipsisVertical } from 'react-icons/io5';

const ChatHeader = ({ conversation, onBack, isMobile, onCloseChat }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  if (!conversation) return null;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showMenu]);

  const handleCloseChat = () => {
    setShowMenu(false);
    if (onCloseChat) {
      onCloseChat();
    }
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <section className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <button 
            onClick={onBack} 
            className="mr-3 p-1 text-gray-600 hover:text-gray-800"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
        )}
        <Avatar text={conversation.contact.avatar || conversation.contact.name} size={12} />
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
          <button
            ref={buttonRef}
            onClick={toggleMenu}
            className="p-1 hover:text-gray-800 focus:outline-none cursor-pointer"
          >
            <IoEllipsisVertical className="w-5 h-5 " />
          </button>
          
          {showMenu && (
            <div 
              ref={menuRef}
              className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-32 cursor-pointer"
            >
              <button
                onClick={handleCloseChat}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Close chat
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatHeader;