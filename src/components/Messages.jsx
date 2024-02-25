import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MessageCard } from './MessageCard';
import { useSearchParams } from "react-router-dom";

export const Messages = ({ currConversationId, messagesIdMap, accessToken, senderMap }) => {
    const [messageMap, setMessageMap] = useState({});
    const [name, setName] = useState('');
    const [msg, setMsg] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [senderImg, setSenderImg] = useState("");
    const [receiverImg, setReceiverImg] = useState("");

    const senderName = senderMap[currConversationId]?.sender_name || "";
    const senderId = senderMap[currConversationId]?.sender_id || "";

    useEffect(() => {
        const fetchSenderImg = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v19.0/${senderId}`, {
                    params: {
                        access_token: accessToken
                    }
                });

                console.log("sender img: ", response);
                setSenderImg(response.data.profile_pic);
            } catch(error) {
                console.error(error);
            }
        }

        fetchSenderImg();
    }, [senderId, currConversationId])
    

    useEffect(() => {
        const fetchMyName = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v19.0/me`, {
                    params: {
                        access_token: accessToken
                    }
                });

                setName(response.data.name);
            } catch(error) {
                console.error(error);
            }
        }

        const fetchMyImage = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v19.0/me?fields=picture`, {
                    params: {
                        access_token: accessToken
                    }
                });

                setReceiverImg(response.data.picture.data.url);
            } catch(error) {
                console.error(error);
            }
        }

        fetchMyName();
        fetchMyImage();
    }, [accessToken])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const msgArray = messagesIdMap[currConversationId];
                const requests = msgArray.map(id =>
                    axios.get(`https://graph.facebook.com/v19.0/${id}?fields=message,created_time,from`, {
                        params: {
                            access_token: accessToken
                        }
                    })
                );
        
                const responses = await Promise.all(requests);
                const messages = responses.reduce((acc, response) => {
                    const { message, created_time, from } = response.data;
                    const key = new Date(created_time).getTime();
                    const sender = from.name;
                    if (!acc[key]) {
                        acc[key] = {};
                    }
                    acc[key][sender] = message;
                    return acc;
                }, {});
        
                const sortedMessages = Object.keys(messages).sort().reduce((acc, key) => {
                    acc[key] = messages[key];
                    return acc;
                }, {});
        
                setMessageMap(sortedMessages);
            } catch (error) {
                console.log(error);
            }
        };

        if (currConversationId && messagesIdMap[currConversationId]) {
            fetchMessages();
        }
    }, [currConversationId, messagesIdMap, accessToken])


    const handleSend = async () => {
        try {
            const PSID = senderMap[currConversationId]?.sender_id;
            if (!PSID) {
                console.error("PSID not found");
                return;
            }

            const pageId = searchParams.get('id');
    
            const response = await axios.post(
                `https://graph.facebook.com/v19.0/${pageId}/messages?access_token=${accessToken}`,
                {
                    recipient: {
                        id: PSID
                    },
                    messaging_type: "RESPONSE",
                    message: {
                        text: msg
                    }
                }
            );

            setMsg("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    

    return (
        <div className="flex flex-col h-screen">
            <div className="h-20 flex items-center border-[1px] border-gray-400 bg-white">
                <h1 className="text-3xl ml-4 font-semibold">{senderName}</h1>
            </div>
            <div className="flex-1 flex-col overflow-y-auto">
                {Object.entries(messageMap).map(([time, messages]) => (
                    <div key={time}>
                        {Object.entries(messages).map(([sender, message]) => (
                            <MessageCard
                                key={`${time}-${sender}`}
                                from={sender}
                                message={message}
                                time={new Date(parseInt(time)).toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true })}
                                alignRight={sender === name}
                                senderImg = {senderImg}
                                receiverImg = {receiverImg}
                            />
                        ))}
                    </div>
                ))}
                {currConversationId && (
                    <div className="flex flex-row items-center justify-center gap-x-4">
                        <input className="w-[80%] h-10 bg-white mb-8 mt-8 rounded-xl border-2 border-gray-400 px-4 py-4"
                            placeholder = {`Message ${senderName}`}
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <button className="bg-blue-900 text-white text-lg px-4 py-[6px] rounded-xl" onClick={handleSend}>Send</button>
                    </div>
                )}
            </div>
        </div>
    )
    
    
}
