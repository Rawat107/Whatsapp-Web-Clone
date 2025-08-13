import React from 'react'

function ChatLIst({ conversations, selectedId, onSelect }) {


  return (
    <section>
        {conversations.map(conv => (
            <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${
                    selectedId === conv.id ? "bg-gray-200" : ''
                }`}
            >
                {conv.name}
            </div>
        ))}
    </section>
  )
}

export default ChatLIst