import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const ConversationCard = ({ senderName, unreadMessageCount, conversationId, accessToken, setCurrConversationId, currConversationId, messagesIdMap, myName }) => {
    const [lastMessage, setLastMessage] = useState("");
    const [lastMessageTime, setLastMessageTime] = useState("");
    const [clicked, setClicked] = useState(false);
    const [showCard, setShowCard] = useState(true);

    useEffect(() => {
        const fetchLastMessage = async () => {
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
                const messages = responses.map(response => response.data);

                // Find the time of the last message from someone other than myName
                let lastMessageTime = null;
                for (let i = messages.length - 1; i >= 0; i--) {
                    const message = messages[i];
                    if (message.from.name !== myName) {
                        lastMessageTime = message.created_time;
                        break;
                    }
                }

                if (lastMessageTime) {
                    const diffInMillis = Date.now() - new Date(lastMessageTime).getTime();
                    if (diffInMillis > 24 * 60 * 60 * 1000) {
                        setShowCard(false);
                    }
                }

            } catch (error) {
                console.error('Error fetching last message:', error);
            }
        };

        if (currConversationId) {
            fetchLastMessage();
        }
    }, [currConversationId, accessToken, messagesIdMap, myName]);


    function getTimeAgo(latestMessageTime) {
        const messageDate = new Date(latestMessageTime);
        const currentDate = new Date();
    
        const diffInMillis = currentDate - messageDate;
        const diffInSeconds = Math.floor(diffInMillis / 1000);
    
        let timeAgo;
    
        if (diffInSeconds < 60) {
            timeAgo = "less than a minute ago";
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
        }
    
        return timeAgo;
    }

    
    useEffect(() => {
        const fetchLastMessage = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v19.0/${conversationId}?fields=messages`, {
                    params: {
                        access_token: accessToken
                    }
                });

                const latestMessageId = response.data.messages.data[0].id;

                const response2 = await axios.get(`https://graph.facebook.com/v19.0/${latestMessageId}?fields=message,created_time`, {
                    params: {
                        access_token: accessToken
                    }
                });

                const latestMessage = response2.data.message;
                setLastMessage(latestMessage);
                const latestMessageTime = response2.data.created_time;

                setLastMessageTime(getTimeAgo(latestMessageTime));
            } catch (err) {
                console.error(err);
            }
        }

        fetchLastMessage();
    }, [lastMessage, conversationId])

    const handleClick = () => {
        setCurrConversationId(conversationId);
        setClicked(true);
    }

    return (
        <>
        {showCard === true && (
            <Card sx={{ minHeight: 100, minWidth: "100%", boxShadow: "none", backgroundColor: clicked ? "#edf2f7" : "inherit", cursor: "pointer" }} className="border-[1px] border-gray-400" onClick={handleClick}>
                <CardContent className="flex flex-col relative">
                    <Box className="flex flex-row">
                        <Checkbox />
                        <Box className="flex flex-col">
                            <Typography variant="h6" component="h6">
                                {senderName}
                            </Typography>
                            <Typography variant="p" component="p">
                                Facebook DM
                            </Typography>
                        </Box>
                        {unreadMessageCount > 0 &&
                            <Box className="flex items-center justify-center  absolute right-6 top-8">
                                <Typography>
                                    {lastMessageTime}
                                </Typography>
                            </Box>
                        }
                    </Box>
                    <Typography sx={{ marginLeft: 1.5, marginTop: 2 }}>
                        {lastMessage}
                    </Typography>
                </CardContent>
            </Card>
        )}
        </>
    )
}
