import React from 'react'
import { ConversationCard } from './ConversationCard'

export const Conversations = ({ senderMap, accessToken, setCurrConversationId, currConversationId, messagesIdMap, myName }) => {
  return (
    <div className="flex flex-col">
        <div className="h-20 flex items-center border-[1px] border-gray-400">
            <h1 className="text-3xl ml-4 font-semibold">Conversations</h1>
        </div>
        <div className='overflow-y-auto'>
            {Object.entries(senderMap).map(([conversationId, senderInfo]) => (
                <ConversationCard
                key={conversationId}
                senderName={senderInfo.sender_name}
                unreadMessageCount={senderInfo.unread_count}
                conversationId={conversationId}
                accessToken={accessToken}
                setCurrConversationId={setCurrConversationId}
                currConversationId={currConversationId}
                messagesIdMap={messagesIdMap}
                myName={myName}
                />
            ))}
      </div>
    </div>
  )
}
