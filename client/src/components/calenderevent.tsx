import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
import { getDate } from '../helpers/formatDate'

const CalenderEvent = ({ channel }) => {
  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      <Box
        display={'flex'}
        gap={2}
        className="flex flex-col bg-background-extralight my-4 px-4 md:px-8 py-8 rounded-md"
      >
        <div className="flex md:flex-row flex-col justify-between items-center w-full">

          <p className="font-bold text-center text-xl">{channel?.name}</p>

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
          </div>
        </div>

        <p className="font-xl text-black text-md">{channel?.desc}</p>
      </Box>

      <Box
        display={'flex'}
        gap={2}
        className="md:flex-row flex-col justify-between my-4 w-full"
      >
        <div className="flex-1 bg-background-extralight px-4 md:px-12 py-4 md:py-8 rounded-md text-center">
          <p className="py-2 font-bold text-xl underline">Venue</p>
          <p className="font-medium text-lg">{channel?.venue}</p>
        </div>
        <div className="flex-1 bg-background-extralight px-4 md:px-12 py-4 md:py-8 rounded-md text-center">
          <p className="py-2 font-bold text-xl underline">Time</p>
          <p className="font-medium text-lg">{`${getDate(
            channel?.startTime,
          )} - ${getDate(channel?.endTime)}`}</p>

        </div>
      </Box>

      <Box
        className="flex flex-col my-8 px-4 md:px-8 py-8 rounded-md items-center">
        <p>Google Maps Coming Soon!</p>
      </Box>
    </div>
  )
}

export default CalenderEvent
