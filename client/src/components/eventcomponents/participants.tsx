// This component is for the participants page. (On the host side)
import React, { useState } from 'react'
import { Box, Link, Avatar, Chip } from '@mui/material'
import { ChatBubbleOutline } from '@mui/icons-material'
import monkey from '../../assets/monkey.png'
import { getDate } from '../../helpers/formatDate'
import { redirect, useParams } from 'react-router-dom'
import useSnackbar from '../../hooks/use-snackbar'

const Participants = ({ participants }) => {
  const [open, setOpen] = useState(false)
  const [rotate, setRotate] = useState(false)
  const setSnackbar = useSnackbar()
  const { eventId } = useParams()
  const frontend = import.meta.env.VITE_CLIENT

  const handleClick = () => {
    setOpen(!open)
    setRotate(!rotate)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${frontend}/join/event/${eventId}`)
      .then(() => {
        setSnackbar({
          open: true,
          content: 'Invite Link copied!',
          type: 'info',
        })
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }

  const renderRole = (role: string) => {
    switch (role) {
      case 'host':
        return (
          <Chip variant="outlined" color="info" label="host" size="small" />
        )
      case 'vendor':
        return (
          <Chip variant="outlined" color="error" label="vendor" size="small" />
        )
      default:
        return (
          <Chip variant="outlined" color="success" label="guest" size="small" />
        )
    }
  }

  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      <Box className="flex justify-between items-center bg-background-extralight my-4 md:px-4 py-2 rounded-md">
        <span className="font-semibold text-xl">
          Total Event Participants: {participants.length}
        </span>
        <button onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`hover:bg-white px-2 py-2 rounded-full w-10 h-10 transition-transform duration-300 ${rotate ? 'rotate-45' : ''
              }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </Box>
      {open && (
        <div className="border-primary-light bg-white px-4 py-10 border min-w-40 font-josefin text-center">
          <p className="py-4 text-3xl">Call your friends and family!! 📩</p>
          <p className="py-2 text-xl">You can share this invite link.</p>
          <Link className="py-2 text-xl wrap cursor-pointer" onClick={handleCopy}>
            {frontend + '/join/event/' + eventId}
          </Link>
        </div>
      )}
      {participants.map((participant) => (
        <Box
          display={'flex'}
          gap={2}
          key={participant.id}
          className="flex md:flex-row flex-col justify-between items-center gap-1 bg-background-extralight my-2 md:px-4 py-3 rounded-md text-center md:text-left"
        >
          <div className="flex items-center gap-3">
            <Avatar
              src={participant?.User?.profilePic || monkey}
              sx={{ width: '60px', height: '60px' }}
            />
            <div className="flex flex-col gap-1">
              <p className="flex gap-2">
                <span className="font-semibold text-xl">
                  {participant?.User?.name}
                </span>
                <span>{renderRole(participant?.role)}</span>
              </p>
              <span className="font-medium text-md text-primary-dull">
                Joined {getDate(participant?.createdDate)}
              </span>
            </div>
          </div>
          {participant.status === 1 ? (
            <ChatBubbleOutline
              className="text-gray-700 cursor-pointer"
              onClick={() => redirect('/')}
            />
          ) : (
            <p>
              {participant.status === 0 ? 'Invite Pending' : 'Invite Rejected'}
            </p>
          )}
        </Box>
      ))}
    </div>
  )
}

export default Participants
