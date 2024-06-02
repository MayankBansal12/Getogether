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
import { formatTime, numericDate } from '../helpers/formatDate'
import { stringAvatar } from '../helpers/avatar'
import { GroupMessageType } from '../global-types/model'

const BACKEND_URL = 'http://localhost:5000'

export default function GroupChat({ groupId }) {
    const [socket, setSocket] = useState(null)
    const callApi = useApi()
    const { eventId } = useParams();
    const { user } = useUserStore(state => state);
    const [messages, setMessages] = useState<GroupMessageType[]>([])
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
        console.log("socket: ", socket, "grpuid: ", groupId)
        if (socket) {
            const handleMessage = (newMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            };

            socket.emit('join-group', { userId: user.id, groupId: groupId });
            socket.on('message', handleMessage);

            return () => {
                socket.off('message', handleMessage);
                socket.emit('leave-group', { userId: user.id, groupId: groupId });
            };

        } else {
            console.log('Error connecting socket!');
        }

        return () => {
            setMessage('');
            setMessages([]);
        };
    }, [socket]);

    // Fetch new messages
    const fetchMessages = async () => {
        const userId = user?.id;

        if (!userId) {
            console.log("Error fetching emssages");
            return;
        }
        try {
            const res = await callApi("/group/message/list", "POST", { eventId: Number(eventId), groupId: Number(groupId) });
            if (res.status === 200) {
                console.log(res.data.messages);
                setMessages(res.data.messages)
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Fetch new messages
    useEffect(() => {
        fetchMessages();
    }, [])

    // Scroll to bottom whenever messages changes!
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Send message func
    const sendMessage = (photoLink = '') => {
        if (!socket || !user || !user.id) {
            console.log("Error sending message ", "senderId: ", user?.id);
            return
        }
        socket.emit('send-message', {
            userId: user.id,
            userName: user.name,
            userAvatar: user.profilePic,
            groupId: groupId,
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
        if (avatar !== '')
            return <Avatar src={avatar} />;
        else
            return <Avatar {...stringAvatar(name)} />
    }

    const renderMessages = () => {
        let lastDate = null
        let lastSender = null

        return messages?.map((item) => {
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
                                {numericDate(item?.time)}
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
                        <button className="absolute right-3 bottom-3 bg-primary-light text-white rounded-full p-2 flex items-center justify-center" onClick={() => sendMessage(imageUrl)}><Send /></button>
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
        </div>
    )
}
