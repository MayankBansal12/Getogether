// Component for the all event page

import React from 'react'
import bday from '../../assets/bday.png'
import { Box } from '@mui/material'

const EventBox = ({ image, title, date, host, onClick }) => {
  return (
    <Box
      my={1}
      mx={1}
      display="flex"
      alignItems="center"
      p={2}
      sx={{ border: '2px solid #8477D7' }}
      className="gap-2 md:gap-4 bg-background-extralight hover:bg-white rounded-md transition-all cursor-pointer"
      onClick={onClick}
    >
      {/** Chage the Image src accordingly */}
      <img
        src={image}
        className="rounded-xl w-[55px] md:w-[75px] h-[55px] md:h-[75px]"
        alt="event profile"
      />
      <div className="md:min-w-96">
        <h1 className="font-bold text-lg md:text-xl">{title}</h1>
        <p className="text-dull text-sm md:text-md">
          Date: {date} | Host: {host}
        </p>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
    </Box>
  )
}
export default EventBox
