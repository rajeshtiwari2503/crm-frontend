import React from 'react'
import ChatReply from '../ChatReply'
import Sidenav from '@/app/components/Sidenav'

const Messages = () => {
  return (
    <Sidenav>
    <div> 
        <ChatReply />
    </div>
    </Sidenav>
  )
}

export default Messages