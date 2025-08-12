
import React from 'react'

function MessageBubble({text, status, time, isOwn}) {
  return (
    <section className={`flex flex-col mb-2 ${isOwn ? "items-end" : "items-start"}`}>
        <div className={`p-2 rounded-lg max-w-xs ${isOwn ? "bg-green-200":"bg-gray-200"} `}>
            {text}
            <div className='text-xs text-gray-500 mt-1 flex justify-between'>
                <span>{time}</span>
                {isOwn && <span>{status}</span>}
            </div>
        </div>
    </section>
  )
}

export default MessageBubble