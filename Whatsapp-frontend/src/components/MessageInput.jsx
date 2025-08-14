
import { useState, useRef } from "react";
import { IoHappyOutline, IoSend, IoMic, IoAdd } from "react-icons/io5";

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
    <section className="px-4 py-3">
      {/* Pebble container */}
      <div
        className="flex items-center bg-white rounded-full border border-gray-200 px-3 py-2
                   shadow-[0_4px_12px_rgba(0,0,0,0.12),2px_0_6px_rgba(0,0,0,0.06)]
                   space-x-3 w-full"
      >
        {/* Attach */}
        <button className="p-2 text-gray-500 hover:text-gray-700 font-extrabold
        ">
          <IoAdd className=" w-5 h-5" />
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message"
          className="flex-1 border-none outline-none text-sm bg-transparent"
        />

        {/* Emoji */}
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <IoHappyOutline className="w-5 h-5" />
        </button>

        {/* Send/Mic */}
        <button
          onClick={value.trim() ? handleSend : undefined}
          className={`p-2 rounded-full transition-all duration-200 shadow-md cursor-pointer ${
            value.trim()
              ? "bg-green-500 text-white hover:bg-green-600"
              : "text-gray-500 hover:text-gray-700 bg-gray-100"
          }`}
        >
          {value.trim() ? (
            <IoSend className="w-5 h-5" />
          ) : (
            <IoMic className="w-5 h-5" />
          )}
        </button>
      </div>
    </section>
  );
};

export default MessageInput;
