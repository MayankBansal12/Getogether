import React, { useEffect, useState } from 'react';
import { Avatar, Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from "../context/SocketContext.jsx";
import { Socket } from 'socket.io-client';


const chat = [
  {
    name: "John",
    message: "Great, let's connect later today. I have a few things I'd like to discuss with you.",
    timestamp: "2024-05-25T12:00:00Z"
  },
  {
    name: "Mayank",
    message: "Sure, let's do it!",
    timestamp: "2024-05-25T12:02:00Z"
  },
  {
    name: "Mayank",
    message: "Hey!",
    timestamp: "2024-05-26T12:02:00Z"
  },
  {
    name: "Mayank",
    message: "WHere are you??",
    timestamp: "2024-05-26T12:02:00Z"
  },
  {
    name: "John",
    message: "Heya!",
    timestamp: "2024-05-27T12:02:00Z"
  }
]

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.substring(0, 1)}`,
  };
}

const formatDate = (timestamp: string) => {
  let date = new Date(timestamp);

  let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let day = date.getUTCDate();
  let monthName = months[date.getUTCMonth()];
  let year = date.getUTCFullYear();

  return `${day} ${monthName} ${year}`;
};

function formatTime(date: string) {
  const now = new Date(date);
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default function Chat() {

  const socket = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const isGroup = false;

  useEffect(() => {
    if (socket) {

      if (isGroup) {
        socket.emit('join-group', { userId: "", groupId: "" });
        const handleMessage = (newMessage: any) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
        socket.on('message', handleMessage);

        return () => {
          socket.off('message', handleMessage);
          socket.emit('leave-group', { userId: "", groupId: "" });
        }
      } else {
        const roomId = `${"eventId"}_${"userId"}_${"receiverId"}`;
        socket.emit('join-dm', { roomId: "" });
        const handleNewDirectMessage = (newMessage: any) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on('newDirectMessage', handleNewDirectMessage);

        return () => {
          socket.off('newDirectMessage', handleNewDirectMessage);
          socket.on('leave-dm', { roomId: "" });
        }
      }
    } else {
      console.log("Error connecting socket!")
    }
  }, [socket]);


  const handleSendMessage = () => {
    if (socket) {
      socket.emit('personal-message', { eventId: "", senderId: "", receiverId: "", message, photoLink: null, roomId: "" });
      setMessage('');
    }
  };

  const handleSendGroupMessage = () => {
    if (socket) {
      socket.emit('send-message', { userId: '1', groupId: '1', message, photoLink: null });
      setMessage('');
    }
  }

  const renderMessages = () => {
    let lastDate = null;
    let lastSender = null;

    return chat.map((item, i) => {
      const messageDate = new Date(item.timestamp).toDateString();
      const showDate = messageDate !== lastDate;
      const showSender = item.name !== lastSender;
      lastDate = messageDate;
      lastSender = item.name;

      return (
        <div key={i}>
          {showDate && <div className="mt-4 flex items-center gap-2">
            <div className="flex-grow border-t border-gray-200"></div>
            <p className="text-center text-[14px] text-gray-500">{formatDate(item.timestamp)}</p>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>}

          {(showSender || showDate) && <div className="mt-4 flex gap-2 items-center">
            <Avatar {...stringAvatar(item.name)} />
            <p className="font-medium text-[18px]">{item.name}</p>
          </div>}

          <div className="flex gap-2 items-center">
            <p className="pl-11 text-gray-600">{item.message}</p>
            <p className="text-[13px] text-gray-500">{formatTime(item.timestamp)}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-4 overflow-auto">
        <div>
          {renderMessages()}
        </div>
      </div>
      <div className="bottom-4 sticky flex gap-2 items-center bg-gray-100 px-4 py-1">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 rounded-lg outline-none"
          placeholder="Type your message..."
          type="text"
        />
        <Button
          onClick={() => {
            console.log('sent message', message)
          }}
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  )
}
