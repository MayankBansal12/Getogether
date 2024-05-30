// This component lists all the subevent
import React from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ChannelType } from "../../global-types/model"
import { getDate } from '../../helpers/formatDate'

interface SubeventsProps {
  channels: ChannelType[];
}

const Subevents = ({ channels }: SubeventsProps) => {
  const navigate = useNavigate()

  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      <Box className="flex justify-between items-center bg-background-extralight my-4 px-4 md:px-8 py-4">
        <span className="font-bold text-xl">Total Sub Events: {channels.length}</span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="hover:bg-white px-2 py-2 rounded-full w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </span>
      </Box>

      {channels.length < 1 ? <div className="text-center">No sub events listed!</div> :
        channels.map(channel => (
          <Box
            key={channel.id}
            display={'flex'}
            gap={4}
            className="flex md:flex-row flex-col justify-between items-center border-2 border-transparent hover:border-primary-light bg-background-extralight hover:bg-white rounded-md transition-all cursor-pointer my-2 px-4 md:px-4 py-2"
          >
            <div className="text-center md:text-left">
              <p className="font-semibold text-xl">
                {"@ " + channel.name.toLowerCase()}
              </p>
              <p className="font-medium text-md text-primary-dull">
                {getDate(channel.startTime)} - {getDate(channel.endTime)}
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="flex px-2 py-1 border border-black rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mx-2 w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                
                <span>{channel.ChannelParticipant?.length || 0} People</span>
              </div>
            </div>
          </Box>
        ))
      }
    </div>
  )
}
export default Subevents
