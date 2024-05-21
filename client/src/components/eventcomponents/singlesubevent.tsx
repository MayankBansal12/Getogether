// This component lists all the subevent

import { Box, Divider } from '@mui/material'
import Button from '../button'

const SingleSubEvent = () => {
  const total = 10
  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      {/* Fetch and change the data over here */}
      <Box
        display={'flex'}
        gap={4}
        className="flex flex-col bg-background-extralight my-4 px-4 md:px-8 py-8"
      >
        <div className="flex md:flex-row flex-col justify-between items-center w-full">
          <p className="font-bold text-center text-xl">
            @ Celebrating{/** {subevent name} */}
          </p>
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
            {/* Write Count of the people joining the subevent */}
            <span>10 People</span>
          </div>
        </div>
        <p className="font-xl text-black text-md">
          Lorem Ipsum is simply dummy text of the Lorem Ipsum is simply dummy
          text of the Lorem Ipsum is simply dummy text of the Lorem Ipsum is
          simply dummy text of the Lorem Ipsum is simply dummy text of the Lorem
          Ipsum is simply dummy text of the Lorem Ipsum is simply dummy text of
          the Lorem Ipsum is simply dummy text of the Lorem Ipsum is simply
          dummy text of the {/** {subevent date} */}
          Lorem Ipsum is simply dummy text of the Lorem Ipsum is simply dummy
          text of the Lorem Ipsum is simply dummy text of the{' '}
        </p>
      </Box>
      {/** Enter Subevent Details */}
      <Box
        display={'flex'}
        gap={2}
        className="md:flex-row flex-col justify-between my-4 w-full"
      >
        <div className="flex-1 bg-background-extralight px-4 md:px-12 py-4 md:py-8 text-center">
          <p className="py-2 font-bold text-xl underline">Venue</p>
          <p className="font-medium text-lg">Express Inn, Santacruz, Mumbai.</p>
        </div>
        <div className="flex-1 bg-background-extralight px-4 md:px-12 py-4 md:py-8 text-center">
          <p className="py-2 font-bold text-xl underline">Time</p>
          <p className="font-medium text-lg">7:00 PM to 8:00 PM</p>
        </div>
        <div className="flex-1 bg-background-extralight px-4 md:px-12 py-4 md:py-8 text-center">
          <p className="py-2 font-bold text-xl underline">Venue</p>
          <p className="font-medium text-lg">Express Inn, Santacruz, Mumbai.</p>
        </div>
      </Box>
      {/* Group Section */}
      <Box
        display={'flex'}
        gap={2}
        className="flex flex-col bg-background-extralight my-4 px-4 md:px-8 py-8"
      >
        <div className="flex md:flex-row flex-col justify-between items-center">
          <span className="font-bold text-xl">Groups</span>
          <Button onClick={() => {}} children={'+ Add Group'} />
        </div>
        <Divider />
        <span className="font-medium text-lg"># Announcements</span>
      </Box>
    </div>
  )
}
export default SingleSubEvent
