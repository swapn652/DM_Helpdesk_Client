import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from "react-router-dom";
import { usePagesContext } from '../PagesContext';
import { LeftPane } from './LeftPane';
import { Conversations } from './Conversations';
import { Messages } from './Messages';
import { CustomerDetails } from './CustomerDetails';
import { useToken } from '../TokenContext.jsx';
import { useNavigate } from "react-router-dom";

export const FBMessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const { pages, setPages } = usePagesContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [accessToken, setAccessToken] = useState("");
  const [senderMap, setSenderMap] = useState({});
  const [messagesIdMap, setMessagesIdMap] = useState({});
  const [messagesMap, setMessagesMap] = useState({});
  const [currConversationId, setCurrConversationId] = useState("");
  const { token, updateToken } = useToken();
  const navigate = useNavigate();
  const [myName, setMyName] = useState('');

    useEffect(() => {
        if(token === "")
            navigate("/login");
    }, [token])

    useEffect(() => {
      const fetchMyName = async () => {
          try {
              const response = await axios.get(`https://graph.facebook.com/v19.0/me`, {
                  params: {
                      access_token: accessToken
                  }
              });

              setMyName(response.data.name);
          } catch(error) {
              console.error(error);
          }
      }
      fetchMyName();
  }, [accessToken])


  useEffect(() => {
    const fetchConversations = async () => {
        try {
            const id = searchParams.get('id');
            const page = pages.find(page => page.id === id);
        
            if (page)
              setAccessToken(page.access_token);

            const response = await axios.get(`https://graph.facebook.com/v19.0/${id}/conversations`, {
                params: {
                    access_token: accessToken
                }
            });

            // console.log(response.data.data);
            const formattedConversations = response.data.data.map(conversation => ({
                id: conversation.id,
                updated_time: conversation.updated_time
            }));

            setConversations(formattedConversations);
        } catch(error) {
            console.error(error);
        }
    };

    fetchConversations();
  }, [searchParams, accessToken, conversations])


  useEffect(() => {
    const fetchConversationInfo = async () => {
      try {
        const senderMapData = {};
        const messagesMapData = {};

        for (const conversation of conversations) {
          const response = await axios.get(`https://graph.facebook.com/v19.0/${conversation.id}?fields=messages,senders,unread_count`, {
            params: {
              access_token: accessToken
            }
          });
          const { messages, senders, unread_count } = response.data;

          // Extract sender info
          const sender = senders.data[0]; // Assuming only one sender
          const senderData = {
            sender_name: sender.name,
            sender_id: sender.id,
            unread_count: unread_count
          };
          senderMapData[conversation.id] = senderData;

          // Extract message ids
          const messageIds = messages.data.map(message => message.id);
          messagesMapData[conversation.id] = messageIds;
        }

        setSenderMap(senderMapData);
        setMessagesIdMap(messagesMapData);
      } catch(error) {
        console.error(error);
      }
    };

    fetchConversationInfo();
  }, [conversations]);


  return (
    <div className = "flex flex-row max-h-screen">
        <div className = "w-[5%]">
          <LeftPane/>
        </div>
        <div className = "w-[25%]">
          <Conversations senderMap = {senderMap} accessToken={accessToken} setCurrConversationId={setCurrConversationId} messagesIdMap={messagesIdMap} myName={myName}/>
        </div>
        <div className = "w-[45%] bg-gray-200 border-[1px] border-gray-400">
          <Messages currConversationId={currConversationId} messagesIdMap={messagesIdMap} accessToken={accessToken} senderMap={senderMap}/>
        </div>
        <div className = "w-[25%] bg-gray-200">
          <CustomerDetails senderMap={senderMap} currConversationId={currConversationId} accessToken={accessToken}/>
        </div>
    </div>
  )
}
