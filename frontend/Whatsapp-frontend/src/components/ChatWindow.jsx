import React from 'react'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

function ChatWindow({ conversation, onSendMessage }) {

    if(!conversation){
        return <div className='flex-1 items-center justify-center text-gray-500'> Select a Converstation </div>
    }

    return (
        <section className='flex flex-col flex-1'>
            <ChatHeader 
                name={conversation.name}
            />

            <div className='flex-1 p-4 overflow-y-auto'>
                {conversation.messages.map(msg => (
                    <MessageBubble 
                        key={msg.id}
                        text={msg.text}
                        status={msg.status}
                        time={msg.time}
                        isOwn={msg.status !== undefined}
                    />
                ))}
            </div>
            <MessageInput onSend={onSendMessage}/>
        </section>
    )
}

export default ChatWindow