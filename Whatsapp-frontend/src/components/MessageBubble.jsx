/**
 * MessageBubble - Individual message with WhatsApp styling
 */

import { IoCheckmark, IoCheckmarkDone } from "react-icons/io5";
import { formatMessageTime } from "../utils/time";

const StatusIcon = ({ status }) => {
  if (status === "sent") return <IoCheckmark className="text-gray-400 w-4 h-4" />;
  if (status === "delivered") return <IoCheckmarkDone className="text-gray-400 w-4 h-4" />;
  if (status === "read") return <IoCheckmarkDone className="text-blue-400 w-4 h-4" />;
  return null;
};

const MessageBubble = ({ message, isOutgoing }) => {
  return (
    <div className={`px-4 py-2 flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[78%] px-3 py-2 rounded-lg shadow-sm break-words ${
        isOutgoing ? "bg-green-100 text-gray-900" : "bg-white text-gray-900 "
      }`}>
        <div className="whitespace-pre-wrap">{message.text}</div>
        <div className="flex items-center justify-end gap-2 mt-1 text-xs text-gray-500">
          <span>{formatMessageTime(message.timestamp)}</span>
          {isOutgoing && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;