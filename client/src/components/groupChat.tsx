/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useRef, useEffect, useState } from 'react'
import { Avatar, Button, Modal } from '@mui/material'
import {
  Send,
  ArrowDownward,
  AttachFile,
  HighlightOff,
} from '@mui/icons-material'
import { io } from 'socket.io-client'
import ImageHelper from '../services/image'
import { useUserStore } from '../global-store/store'
import { useParams } from 'react-router-dom'
import useApi from '../hooks/use-api'
import { formatTime, numericDate } from '../helpers/formatDate'
import { stringAvatar } from '../helpers/avatar'
import { GroupMessageType } from '../global-types/model'

const BACKEND_URL = import.meta.env.VITE_SERVER || 'http://localhost:5000'

export default function GroupChat({ group }) {
  const [socket, setSocket] = useState(null)
  const callApi = useApi()
  const { eventId } = useParams()
  const { user } = useUserStore((state) => state)
  const [messages, setMessages] = useState<GroupMessageType[]>([])
  const [message, setMessage] = useState('')
  const [showScroll, setShowScroll] = useState(false)
  const chatContainerRef = useRef(null)
  const [showPhoto, setShowPhoto] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [allowMessage, setAllowMessage] = useState(false);
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
    console.log('socket: ', socket, 'grpuid: ', group.id)
    if (socket) {
      const handleMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage])
      }

      socket.emit('join-group', { userId: user.id, groupId: group.id })
      socket.on('message', handleMessage)

      return () => {
        socket.off('message', handleMessage)
        socket.emit('leave-group', { userId: user.id, groupId: group.id })
      }
    } else {
      console.log('Error connecting socket!')
    }

    return () => {
      setMessage('')
      setMessages([])
    }
  }, [socket, group])

  // Fetch new messages
  const fetchMessages = async () => {
    const userId = user?.id

    if (!userId) {
      console.log('Error fetching emssages')
      return
    }
    try {
      const res = await callApi('/group/message/list', 'POST', {
        eventId: Number(eventId),
        groupId: Number(group.id),
      })
      if (res.status === 200) {
        console.log(res.data.messages)
        setMessages(res.data.messages)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch new messages
  useEffect(() => {
    const groupName: string = group.name.toLowerCase();
    console.log("details: ", user.role, groupName);

    if (user.role === "host") setAllowMessage(true);
    else if (user.role === "vendor" && groupName !== "announcements") setAllowMessage(true);
    else if (groupName !== "announcements" && groupName !== "vendor") setAllowMessage(true);
    else setAllowMessage(false);

    fetchMessages()
  }, [group])

  // Scroll to bottom whenever messages changes!
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message func
  const sendMessage = (photoLink = '') => {
    if (!socket || !user || !user.id) {
      console.log('Error sending message ', 'senderId: ', user?.id)
      return
    }
    socket.emit('send-message', {
      userId: user.id,
      userName: user.name,
      userAvatar: user.profilePic,
      groupId: group.id,
      message,
      photoLink: photoLink,
    })
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

  const showAvatar = (avatar: string, name: string) => {
    if (avatar !== '') return <Avatar src={avatar} />
    else return <Avatar {...stringAvatar(name)} />
  }

  const renderMessages = () => {
    let lastDate = null
    let lastSender = null

    return messages.length > 0 ? (
      messages?.map((item) => {
        const messageDate = new Date(item.time).toDateString()
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
                  {messageDate}
                </p>
                <div className="flex-grow border-gray-200 border-t"></div>
              </div>
            )}

            {(showSender || showDate) && (
              <div className="flex items-center gap-2 mt-4">
                {showAvatar(item.senderAvatar, item.senderName)}
                <p className="font-medium text-[18px]">{item.senderName} </p>
              </div>
            )}

            <div className="flex items-end gap-2">
              {!item?.photos || item?.photos === '' ? (
                <p className="ml-12 text-gray-600">{item?.message}</p>
              ) : (
                <img
                  className="mb-2 ml-12 rounded-md w-[500px] cursor-pointer"
                  src={item?.photos}
                  alt="img"
                  onClick={() => {
                    setShowPhoto(item?.photos)
                    handleOpen()
                  }}
                />
              )}
              <p className="text-[14px] text-gray-500">
                {formatTime(item?.time)}
              </p>
            </div>
          </div>
        )
      })
    ) : (
      <div className="flex h-4/5 justify-center items-center opacity-50 text-md">No messages yet!</div>
    )
  }

  async function HandleImage(img: File) {
    try {
      const base64Img = await ImageHelper.ConvertBase64(img)
      setImageUrl(base64Img as string)
      handleOpenPreview()
    } catch (error) {
      console.log('Error encoding image: ', error)
    }
  }

  return (
    <div className="relative flex flex-col h-[85vh]">
      <div
        className="flex-1 p-4 overflow-auto"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <h2 className="flex justify-center items-center font-medium opacity-70 mb-4 underline">{group.desc.substring(0, 200) + "..."}</h2>
        {renderMessages()}

        <Modal
          open={open}
          onClose={handleClose}
          className="flex justify-center items-center"
        >
          <div className="relative">
            <img
              src={showPhoto}
              alt="img"
              className="max-w-[500px] lg:max-w-[1000px] max-h-[500px] lg:max-h-[1000px]"
            />
            <button
              className="top-1 right-1 absolute text-gray-300"
              onClick={handleClose}
            >
              <HighlightOff />
            </button>
          </div>
        </Modal>

        <Modal
          open={preview}
          onClose={handleClosePreview}
          className="flex flex-col justify-center items-center"
        >
          <div className="relative">
            <img
              src={imageUrl}
              alt="img"
              className="max-w-[500px] lg:max-w-[950px] max-h-[500px] lg:max-h-[950px]"
            />
            <button
              className="right-3 bottom-3 absolute flex justify-center items-center bg-primary-light p-2 rounded-full text-white"
              onClick={() => sendMessage(imageUrl)}
            >
              <Send />
            </button>
          </div>
        </Modal>
      </div>
      {showScroll && (
        <button
          className="right-2 bottom-16 absolute bg-gray-200 p-1 rounded-full w-8"
          onClick={scrollToBottom}
        >
          <ArrowDownward />
        </button>
      )}
      {allowMessage &&
        <form
          className="bottom-2 sticky flex items-center gap-2 bg-gray-100 px-4 py-1"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
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
      }
    </div>
  )
}
