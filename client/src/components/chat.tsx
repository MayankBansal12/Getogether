/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useRef, useEffect, useState } from 'react'
import { Avatar, Button, Modal } from '@mui/material'
import { Send, ArrowDownward, AttachFile, HighlightOff } from '@mui/icons-material'
import { io } from 'socket.io-client'
import ImageHelper from '../services/image'
import { useUserStore } from '../global-store/store'
import { useParams } from 'react-router-dom'
import useApi from '../hooks/use-api'

const BACKEND_URL = 'http://localhost:5000'

const chat = [
  {
    name: 'John',
    message:
      "Great, let's connect later today. I have a few things I'd like to discuss with you.",
    timestamp: '2024-05-25T12:00:00Z',
  },
  {
    name: 'Mayank',
    message: "Sure, let's do it!",
    timestamp: '2024-05-25T12:02:00Z',
  },
  {
    name: 'Mayank',
    message: 'Hey!',
    timestamp: '2024-05-26T12:02:00Z',
  },
  {
    name: 'Mayank',
    message: 'WHere are you??',
    timestamp: '2024-05-26T12:02:00Z',
  },
  {
    name: 'John',
    message: 'Heya!',
    timestamp: '2024-05-27T12:02:00Z',
  },
  {
    name: 'John',
    message: 'Hey! Want to get in touch with you, are you available?',
    timestamp: '2024-05-29T02:00:00Z',
  },
  {
    name: 'Mayank',
    message:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    timestamp: '2024-05-29T15:06:09Z',
  },
  {
    name: 'John',
    message: '',
    photoLink:
      'https://res.cloudinary.com/dwuyp1nss/image/upload/v1716661873/ntw8fwnqc1mnvu9wf3vq.jpg',
    timestamp: '2024-05-30T19:48:39Z',
  },
  {
    name: 'Mayank',
    message: '',
    photoLink:
      'https://res.cloudinary.com/dwuyp1nss/image/upload/v1703774198/Website%20Demo/Home_Page_omsuhd.png',
    timestamp: '2024-05-30T20:14:19Z',
  },
  {
    name: 'Mayank',
    message: 'See, this works?',
    photoLink: '',
    timestamp: '2024-05-30T20:15:10Z',
  },
  {
    name: 'John',
    message: '',
    photoLink:
      'https://res.cloudinary.com/dwuyp1nss/image/upload/v1716661873/ntw8fwnqc1mnvu9wf3vq.jpg',
    timestamp: '2024-05-30T20:48:19Z',
  },
  {
    name: 'John',
    message: '',
    photoLink:
      'https://res.cloudinary.com/dwuyp1nss/image/upload/v1716661873/ntw8fwnqc1mnvu9wf3vq.jpg',
    timestamp: '2024-05-30T20:48:29Z',
  },
  {
    name: 'John',
    message: 'Sorry sent it twice!',
    photoLink: '',
    timestamp: '2024-05-30T20:49:01Z',
  },
]

function stringToColor(string: string) {
  let hash = 0
  let i

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.substring(0, 1)}`,
  }
}

const formatDate = (timestamp: string) => {
  let date = new Date(timestamp)

  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  let day = date.getUTCDate()
  let monthName = months[date.getUTCMonth()]
  let year = date.getUTCFullYear()

  return `${day} ${monthName} ${year}`
}

function formatTime(date: string) {
  const now = new Date(date)
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export default function Chat({ selectedUser, isGroup, groupId = null }) {
  const [socket, setSocket] = useState(null)
  const { eventId } = useParams();
  const { user } = useUserStore(state => state);
  const [participant, setParticipant] = useState(null)
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [showScroll, setShowScroll] = useState(false)
  const chatContainerRef = useRef(null)
  const [showPhoto, setShowPhoto] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [preview, setPreview] = useState(false)
  const handleOpenPreview = () => setPreview(true)
  const handleClosePreview = () => setPreview(false)

  // connect to the socket
  useEffect(() => {
    const newSocket = io(BACKEND_URL)
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  // Join room in case of user, group connects
  useEffect(() => {
    console.log("selected user: ", selectedUser);

    if (selectedUser) {
      setParticipant({ ...selectedUser.user, "participantId": selectedUser.participantId });
    }

    if (socket) {
      let roomId = '';
      const handleMessage = (newMessage) => {
        console.log("message recd: ", newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      if (isGroup) {
        socket.emit('join-group', { userId: user.id, groupId: groupId });
        socket.on('message', handleMessage);

        return () => {
          socket.off('message', handleMessage);
          socket.emit('leave-group', { userId: user.id, groupId: groupId });
        };
      } else {
        if (!selectedUser) {
          console.log("can't connect!");
          return;
        }

        let userId1 = Number(user.id);
        let userId2 = Number(selectedUser.user.id);

        roomId = userId1 < userId2 ? `${userId1}_${eventId}_${userId2}` : `${userId2}_${eventId}_${userId1}`;

        console.log('trying to connect with room id: ', roomId);
        socket.emit("join-dm", { roomId: roomId });
        socket.on('newDirectMessage', handleMessage);

        return () => {
          socket.off('newDirectMessage', handleMessage);
          socket.emit('leave-dm', { roomId: roomId });
        };
      }
    } else {
      console.log('Error connecting socket!');
    }

    return () => {
      setMessage('');
      setMessages([]);
    };
  }, [socket, selectedUser]);

  // Fetch new messages
  const fetchMessages = async () => {
    const userId = user?.id;
    const participantId = participant?.id;
    if (!userId || !participantId) {
      console.log("Error fetching emssages");
      return;
    }
    try {
      const res = await useApi("/user/messages", "POST", { eventId: Number(eventId), userId, participantId });
      if (res.status === 200) {
        console.log(res.data);
        setMessages(res.data.messages)
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch new messages whenever participant or user changes
  useEffect(() => {
    fetchMessages();
  }, [user, participant])

  // Scroll to bottom whenever messages changes!
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message func
  const sendMessage = (senderId: number, participantId: number, photoLink = '') => {
    if (!socket || !senderId || !participantId) {
      console.log("Error sending message ", "senderId: ", senderId, " particid: ", participantId);
      console.log(participant);
      return
    }
    if (isGroup) {
      socket.emit('send-message', {
        userId: 1,
        groupId: 1,
        message,
        photoLink: photoLink,
      })
    } else {
      socket.emit('personal-message', {
        eventId: Number(eventId),
        senderId: senderId,
        receiverId: participantId,
        message,
        photoLink: photoLink,
        roomId: senderId < participantId ? `${senderId}_${eventId}_${participantId}` : `${participantId}_${eventId}_${senderId}`
      })
    }
    setMessage('')
    handleClosePreview()
    setImageUrl('')
  }

  // Scroll to bottom chat section
  const scrollToBottom = () => {
    console.log('scroll to bottom', chatContainerRef)
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      console.log(' chatcontainer details: ', chatContainerRef.current)
    }
  }

  const handleScroll = () => {
    if (
      chatContainerRef.current?.scrollHeight -
      Math.ceil(chatContainerRef.current?.scrollTop) <=
      chatContainerRef.current?.clientHeight
    ) {
      setShowScroll(false)
    } else {
      setShowScroll(true)
    }
  }

  const renderMessages = () => {
    let lastDate = null
    let lastSender = null

    return messages?.map((item) => {
      const messageDate = new Date(item.timestamp).toDateString()
      const showDate = messageDate !== lastDate
      const showSender = item.senderId !== lastSender
      lastDate = messageDate
      lastSender = item.senderId

      return (
        <div key={item.id}>
          {showDate && (
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-grow border-gray-200 border-t"></div>
              <p className="text-[14px] text-center text-gray-500">
                {formatDate(item.time)}
              </p>
              <div className="flex-grow border-gray-200 border-t"></div>
            </div>
          )}

          {(showSender || showDate) && (
            <div className="flex items-center gap-2 mt-4">
              <Avatar {...stringAvatar(item.senderId === user.id ? user.name : participant.name)} />
              <p className="font-medium text-[18px]">{item.senderId === user.id ? user.name : participant.name} </p>
            </div>
          )}

          <div className="flex items-end gap-2">
            {!item.photos || item.photos === '' ? (
              <p className="ml-12 text-gray-600">{item.message}</p>
            ) : (
              <img
                className="mb-2 ml-12 rounded-md w-[500px] cursor-pointer"
                src={item.photos}
                alt="img"
                onClick={() => {
                  setShowPhoto(item.photos)
                  handleOpen()
                }}
              />
            )}
            <p className="text-[14px] text-gray-500">
              {formatTime(item.time)}
            </p>
          </div>
        </div>
      )
    })
  }

  async function HandleImage(img: File) {
    try {
      const base64Img = await ImageHelper.ConvertBase64(img)
      setImageUrl(base64Img as string)
      handleOpenPreview();
    } catch (error) {
      console.log("Error encoding image: ", error)
    }
  }

  return (
    <div className="flex flex-col h-[85vh] relative">
      <div
        className="flex-1 p-4 overflow-auto"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {renderMessages()}

        <Modal
          open={open}
          onClose={handleClose}
          className="flex justify-center items-center"
        >
          <div className="relative">
            <img src={showPhoto} alt="img" className="max-w-[500px] max-h-[500px] lg:max-w-[1000px] lg:max-h-[1000px]" />
            <button className="absolute right-1 top-1 text-gray-300" onClick={handleClose}><HighlightOff /></button>
          </div>
        </Modal>

        <Modal
          open={preview}
          onClose={handleClosePreview}
          className="flex flex-col justify-center items-center"
        >
          <div className="relative">
            <img src={imageUrl} alt="img" className="max-w-[500px] max-h-[500px] lg:max-w-[950px] lg:max-h-[950px]" />
            <button className="absolute right-3 bottom-3 bg-primary-light text-white rounded-full p-2 flex items-center justify-center" onClick={() => sendMessage(user?.id, participant?.id, imageUrl)}><Send /></button>
          </div>
        </Modal>
      </div>
      {showScroll && (
        <button
          className="absolute right-2 w-8 bottom-16 bg-gray-200 p-1 rounded-full"
          onClick={scrollToBottom}>
          <ArrowDownward />
        </button>
      )}
      <form
        className="bottom-2 sticky flex items-center gap-2 bg-gray-100 px-4 py-1"
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(user?.id, participant?.id)
        }}
      >
        <input
          type="file"
          title="upload image"
          placeholder="upload image"
          name="image"
          accept="image/*"
          id="image"
          onChange={(e) => HandleImage(e.target.files[0])}
          className="hidden"
        />
        <label htmlFor="image" className="cursor-pointer">
          <AttachFile />
        </label>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent px-4 py-2 rounded-lg outline-none"
          placeholder="Type your message..."
          type="text"
        />
        <Button type="submit">
          <Send />
        </Button>
      </form>
    </div>
  )
}
