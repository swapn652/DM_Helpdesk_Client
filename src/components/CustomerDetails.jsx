import React, {useState, useEffect} from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import axios from 'axios';

export const CustomerDetails = ({ senderMap, currConversationId, accessToken }) => {
    // Check if senderMap[currConversationId] exists before accessing its properties
    const senderName = senderMap[currConversationId]?.sender_name || "";
    const[profilePic, setProfilePic] = useState("");

    useEffect(() => { 
        // console.log("id:", senderMap[currConversationId]?.sender_id)
        const fetchProfilePic = async () => {
            try {
                const response = await axios.get(`https://graph.facebook.com/v19.0/${senderMap[currConversationId]?.sender_id}`, {
                    params: {
                        access_token: accessToken
                    }
                })
                
                // console.log("pic: ", response.data.profile_pic);
                setProfilePic(response.data.profile_pic);

            } catch(error) {
                console.error(error);
            }
        }

        fetchProfilePic();
    }, [currConversationId])

    // Render the content only when senderName is not empty
    return (
        <>
            {senderName && (
                <div className="flex flex-col justify-center">
                    <Card sx={{ minHeight: 300, minWidth: "100%", boxShadow: "none" }} className="border-[1px] border-gray-400">
                        <CardContent className="flex flex-col items-center justify-center">
                            <img src={profilePic} className="mt-4 w-20 h-20 rounded-[20rem]" />
                            <Typography variant="h5" className="font-semibold" sx={{ marginLeft: 1.5, marginTop: 2 }}>
                                {senderName}
                            </Typography>
                            <Box className="flex flex-row gap-x-2 items-center">
                                <div className="h-2 w-2 rounded-2xl bg-green-600"></div>
                                <p className="text-gray-400">Online</p>
                            </Box>
                        </CardContent>
                        <CardActions className="flex flex-row gap-x-6 items-center justify-center">
                            <button className="py-2 px-4 rounded-lg border-2 border-gray-400 flex flex-row items-center gap-x-2 text-lg font-semibold"><img src="./call-icon.png" className="w-6" />Call</button>
                            <button className="py-2 px-4 rounded-lg border-2 border-gray-400 flex flex-row items-center gap-x-2 text-lg font-semibold"><img src="./profile-icon.png" className="w-6" />Profile</button>
                        </CardActions>
                    </Card>

                    {currConversationId && senderMap[currConversationId] && (
                        <Card sx={{ minHeight: 150, maxWidth: "90%", margin: 2, borderRadius: 5 }}>
                            <CardContent className="flex flex-col">
                                <Typography variant="h6" className="font-semibold">
                                    Customer Details
                                </Typography>
                                <Box className="flex flex-row mt-2 justify-between">
                                    <Typography className="text-gray-400">
                                        Email
                                    </Typography>
                                    <Typography className="flex-shrink">
                                        swapnilpant0652@gmail.com
                                    </Typography>
                                </Box>
                                <Box className="flex flex-row mt-2 justify-between">
                                    <Typography className="text-gray-400">
                                        {senderName.split(" ")[0]}
                                    </Typography>
                                    <Typography className="flex-shrink">
                                        Swapnil
                                    </Typography>
                                </Box>
                                <Box className="flex flex-row mt-2 mb-2 justify-between">
                                    <Typography className="text-gray-400">
                                        Last Name
                                    </Typography>
                                    <Typography className="flex-shrink">
                                        {senderName.split(" ")[1]}
                                    </Typography>
                                </Box>
                                <Typography className="text-xl text-blue-700 cursor-pointer">
                                    View more details
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
        </>
    );
};
