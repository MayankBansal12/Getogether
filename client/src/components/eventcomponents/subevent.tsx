// This component lists all the subevent
import React from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Subevents = () => {
  const total = 10

  const navigate = useNavigate()
  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      <Box className="flex justify-between items-center bg-background-extralight my-4 px-4 md:px-8 py-4">
        <span className="font-bold text-xl">Total Sub Events: {total}</span>
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
      {/* Fetch and change the data over here */}
      <Box
        display={'flex'}
        gap={4}
        className="flex md:flex-row flex-col justify-between items-center hover:border-2 hover:border-primary-light bg-background-extralight hover:bg-white my-4 px-4 md:px-8 py-4"
      >
        <div className="text-center md:text-left">
          <p className="font-semibold text-xl">
            @ Celebrating{/** {subevent name} */}
          </p>
          <p className="font-medium text-md text-primary-dull">
            On 25th Mar, 2024 7:00 PM {/** {subevent date} */}
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
            {/* Write Count of the people joining the subevent */}
            <span>10 People</span>
          </div>
        </div>
      </Box>
      {/** Delete following two box below after fetch impl */}
      <Box
        display={'flex'}
        gap={4}
        className="flex md:flex-row flex-col justify-between items-center hover:border-2 hover:border-primary-light bg-background-extralight hover:bg-white my-4 px-4 md:px-8 py-4"
      >
        <div className="text-center md:text-left">
          <p className="font-semibold text-xl">
            @ Game Zone{/** {subevent name} */}
          </p>
          <p className="font-medium text-md text-primary-dull">
            On 25th Mar, 2024 7:00 PM {/** {subevent date} */}
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
            {/* Write Count of the people joining the subevent */}
            <span>10 People</span>
          </div>
        </div>
      </Box>
      <Box
        display={'flex'}
        gap={4}
        className="flex md:flex-row flex-col justify-between items-center hover:border-2 hover:border-primary-light bg-background-extralight hover:bg-white my-4 px-4 md:px-8 py-4"
      >
        <div className="text-center md:text-left">
          <p className="font-semibold text-xl">
            @ After Bday Party{/** {subevent name} */}
          </p>
          <p className="font-medium text-md text-primary-dull">
            On 25th Mar, 2024 7:00 PM {/** {subevent date} */}
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
            {/* Write Count of the people joining the subevent */}
            <span>10 People</span>
          </div>
        </div>
      </Box>
    </div>
  )
}
export default Subevents
