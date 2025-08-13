/**
 * MessageInput - Input area for typing and sending messages
 */

import { useState, useRef } from "react";
import { IoAttach, IoHappyOutline, IoSend } from "react-icons/io5";

const MessageInput = ({ onSend }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
    inputRef.current?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex items-center gap-3">
        
        {/* Attachment button */}
        <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <IoAttach className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* Input field */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message"
            className="w-full px-4 py-3 pr-12 bg-white rounded-full border border-gray-200 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          
          {/* Emoji button */}
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <IoHappyOutline className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim()}
          className={`p-3 rounded-full transition-colors ${
            value.trim() 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <IoSend className="w-5 h-5" />
        </button>
      </div>
    </footer>
  );
};

export default MessageInput;