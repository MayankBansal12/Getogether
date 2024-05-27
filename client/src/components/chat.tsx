import React, { useRef, useEffect, useState } from 'react';
import { Avatar, Button, Modal } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward.js';
import { io } from 'socket.io-client';
import ImageHelper from "../services/image";
import AttachFileIcon from '@mui/icons-material/AttachFile';

const BACKEND_URL = 'http://localhost:5000'

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
  },
  {
    name: "John",
    message: "Hey! Want to get in touch with you, are you available?",
    timestamp: "2024-05-29T02:00:00Z"
  },
  {
    name: "Mayank",
    message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    timestamp: "2024-05-29T15:06:09Z"
  },
  {
    name: "John",
    message: "",
    photoLink: "https://res.cloudinary.com/dwuyp1nss/image/upload/v1716661873/ntw8fwnqc1mnvu9wf3vq.jpg",
    timestamp: "2024-05-30T19:48:39Z"
  },
  {
    name: "Mayank",
    message: "",
    photoLink: "https://res.cloudinary.com/dwuyp1nss/image/upload/v1703774198/Website%20Demo/Home_Page_omsuhd.png",
    timestamp: "2024-05-30T20:14:19Z"
  },
  {
    name: "Mayank",
    message: "See, this works?",
    photoLink: "",
    timestamp: "2024-05-30T20:15:10Z"
  },
  {
    name: "John",
    message: "",
    photoLink: "https://res.cloudinary.com/dwuyp1nss/image/upload/v1716661873/ntw8fwnqc1mnvu9wf3vq.jpg",
    timestamp: "2024-05-30T20:48:19Z"
  },
  {
    name: "John",
    message: "",
    photoLink: "https://res.cloudinary.com/dwuyp1nss/image/upload/v1716661873/ntw8fwnqc1mnvu9wf3vq.jpg",
    timestamp: "2024-05-30T20:48:29Z"
  },
  {
    name: "John",
    message: "Sorry sent it twice!",
    photoLink: "",
    timestamp: "2024-05-30T20:49:01Z"
  },
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
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [showScroll, setShowScroll] = useState(false);
  const isGroup = false;
  const chatContainerRef = useRef(null);
  const [showPhoto, setShowPhoto] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

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
        const roomId = `${2}_${1}_${2}`;

        console.log("tyring to connect with room id: ", roomId);
        socket.emit('join-dm', { roomId: roomId });
        const handleNewDirectMessage = (newMessage: any) => {
          console.log("Handle new message ", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on('newDirectMessage', handleNewDirectMessage);

        scrollToBottom();

        return () => {
          socket.off('newDirectMessage', handleNewDirectMessage);
          socket.emit('leave-dm', { roomId: roomId });
        }
      }
    } else {
      console.log("Error connecting socket!")
    }

    return () => {
      setMessage("");
      setMessages([]);
    }
  }, [socket]);

  const sendMessage = (photoLink = "") => {
    if (!socket) {
      return;
    }
    if (isGroup) {
      socket.emit('send-message', { userId: 1, groupId: 1, message, photoLink: photoLink });
      setMessage('');
    } else {
      socket.emit('personal-message', { eventId: 2, senderId: 1, receiverId: 2, message, photoLink: photoLink, roomId: `${2}_${1}_${2}` });
      setMessage('');
    }
  }

  // Scroll to bottom chat section
  const scrollToBottom = () => {
    console.log("scroll to bottom", chatContainerRef);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      console.log(" chatcontainer details: ", chatContainerRef.current);
    }
  }

  useEffect(() => {
    console.log("Image url generated: ", imageUrl);
    sendMessage(imageUrl);
  }, [imageUrl])

  const handleScroll = () => {
    if (chatContainerRef.current?.scrollHeight - Math.ceil(chatContainerRef.current?.scrollTop) <= chatContainerRef.current?.clientHeight) {
      setShowScroll(false);
    } else {
      setShowScroll(true);
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

          <div className="flex gap-2 items-end">
            {!item.photoLink || item.photoLink === '' ?
              <p className="ml-12 text-gray-600">{item.message}</p> : <img className="rounded-md ml-12 mb-2 max-w-[500px] cursor-pointer" src={item.photoLink} alt="img" onClick={() => {
                setShowPhoto(item.photoLink);
                handleOpen();
              }} />
            }
            <p className="text-[14px] text-gray-500">{formatTime(item.timestamp)}</p>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="flex-1 p-4 overflow-auto" ref={chatContainerRef} onScroll={handleScroll}>
        {renderMessages()}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="flex justify-center items-center"
        >
          <img src={showPhoto} alt="img" className="w-4/5 h-4/5" />
        </Modal>

        {showScroll && <Button className="sticky bottom-2 right-2 bg-[#E2E2E2] p-1 rounded-full" onClick={scrollToBottom}>
          <ArrowDownwardIcon />
        </Button>}
      </div>
      <form className="bottom-2 sticky flex gap-2 items-center bg-gray-100 px-4 py-1" onSubmit={(e) => {
        e.preventDefault()
        sendMessage()
      }}>
        <input
          type="file"
          title='upload image'
          placeholder='upload image'
          name='image'
          accept="image/*"
          id="image"
          onChange={(e) => setImageUrl(ImageHelper.GetUrl(e))}
          className="hidden"
        />
        <label htmlFor="image" className="cursor-pointer">
          <AttachFileIcon />
        </label>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 rounded-lg outline-none"
          placeholder="Type your message..."
          type="text"
        />
        <Button
          onClick={() => sendMessage()}
        >
          <SendIcon />
        </Button>
      </form>
    </div >
  )
}
