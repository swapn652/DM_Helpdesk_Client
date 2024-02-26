import React, { useState, useEffect } from 'react';
import { ConversationCard } from './ConversationCard';
import axios from "axios";

export const Conversations = ({ senderMap, accessToken, setCurrConversationId, messagesIdMap, myName }) => {

  const [showCardMap, setShowCardMap] = useState({});

  useEffect(() => {
      const updateShowCardMap = async () => {
          const newShowCardMap = {};
          for (const conversationId in messagesIdMap) {
              const msgArray = messagesIdMap[conversationId];
              const requests = msgArray.map(id =>
                  axios.get(`https://graph.facebook.com/v19.0/${id}?fields=message,created_time,from`, {
                      params: {
                          access_token: accessToken
                      }
                  })
              );

              const responses = await Promise.all(requests);
              const messages = responses.map(response => response.data);

              // Find the time of the last message from someone other than myName
              let lastMessageTime = null;
              for (let i = 0; i < messages.length; i++) {
                  const message = messages[i];
                  if (message.from !== myName) {
                      lastMessageTime = message.created_time;
                      break;
                  }
              }

              if (lastMessageTime) {
                  const diffInMillis = Date.now() - new Date(lastMessageTime).getTime();
                  newShowCardMap[conversationId] = diffInMillis <= 24 * 60 * 60 * 1000;
              } else {
                  newShowCardMap[conversationId] = false;
              }
          }
          setShowCardMap(newShowCardMap);
      };

      updateShowCardMap();
  }, [messagesIdMap]);


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
                showCard={showCardMap[conversationId]}
                />
            ))}
      </div>
    </div>
  )
}
