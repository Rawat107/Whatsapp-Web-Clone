/**
 * MessageInput - Input area with mic/send toggle like WhatsApp
 */
import { useState, useRef } from "react";
import { IoAttach, IoHappyOutline, IoSend, IoMic } from "react-icons/io5";

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

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
      <div className="flex items-end space-x-2">
        {/* Attach button */}
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <IoAttach className="w-5 h-5" />
        </button>

        {/* Input container */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-2 flex items-end space-x-2">
          {/* Emoji button */}
          <button className="text-gray-500 hover:text-gray-700 p-1">
            <IoHappyOutline className="w-5 h-5" />
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder="Type a message"
            className="flex-1 resize-none border-none outline-none text-sm bg-transparent"
            rows={1}
          />
        </div>

        {/* Send/Mic button */}
        <button
          onClick={value.trim() ? handleSend : undefined}
          className={`p-2 rounded-full transition-all duration-200 ${
            value.trim() 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {value.trim() ? (
            <IoSend className="w-5 h-5" />
          ) : (
            <IoMic className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;