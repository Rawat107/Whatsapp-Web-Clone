

import React from 'react'

function ChatHeader({name}) {
  return (
    <section className='p-4 border-b border-gray-300 bg-gray-100 font-bold'>
        {name}
    </section>
  )
}

export default ChatHeader