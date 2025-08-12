
import React from 'react'
import { useState } from 'react'

function MessageInput({ onSend }) {

    const [message, setMessage] = useState('')

    const send = () => {
        if(!message.trim()) return;
        onSend(message);
        setMessage("")
    }

    return (
    <section className='p-4 border-t border-gray-300 flex'>
        <input value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
            className='flex-grow border rounded-lg px-3 py-2 mr-2'
        />

        <button
            onClick={send}
            className='bg-green-500 text-white px-4 py-2 rounded-lg'
        >
            Send
        </button>
    </section>
    )
}

export default MessageInput