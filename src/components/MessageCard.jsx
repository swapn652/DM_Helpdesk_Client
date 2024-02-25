import React from 'react';
import Typography from '@mui/material/Typography';

export const MessageCard = ({ message, from, time, alignRight, senderImg, receiverImg }) => {
  return (
    <div className="flex flex-col m-4"> 
        <div className={`flex flex-row gap-x-2 items-center ${alignRight ? 'self-end' : 'self-start'}`} >
            <img src={senderImg} className={`h-8 w-8 rounded-[20rem]  ${alignRight ? 'hidden' : 'visible'}`}/>
            <Typography variant="body1" component="p" className="text-black  border-[1px] rounded-lg px-4 py-2 bg-white border-gray-400">
                {message}
            </Typography>
            <img src={receiverImg} className={`h-8 w-8 rounded-[20rem] ${alignRight ? 'visible' : 'hidden'}`}/>
        </div>
        <div className={`flex flex-row gap-x-2 mt-2 items-center font-semibold text-gray-500 text-xs ${alignRight ? 'self-end' : 'self-start'}`}>
            <div>{from}</div>
            <div>{time}</div>
        </div>
    </div>
  )
}
