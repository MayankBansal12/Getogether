// This component is for the participants page. (On the host side)
import React, { useState } from 'react'
import { Box, Link } from '@mui/material'
import monkey from '../../assets/monkey.png'

const Participants = () => {
  //Dummy values. Delete this later
  const participants = 70
  const image = monkey
  const [open, setOpen] = useState(false)
  const [rotate, setRotate] = useState(false)

  const handleClick = () => {
    setOpen(!open)
    setRotate(!rotate)
  }

  const renderRole = (role) => {
    switch (role) {
      case 'host':
        return (
          <span className="border-1 px-2 font-bold text-lg text-primary-light">
            Host
          </span>
        )
      case 'vendor':
        return (
          <span className="border-1 px-2 font-bold text-[#18A33F] text-lg">
            Vendor
          </span>
        )
      default:
        return (
          <span className="border-1 px-2 font-bold text-[#D44343] text-lg">
            Guest
          </span>
        )
    }
  }
  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      <Box className="flex justify-between items-center bg-background-extralight my-4 md:px-8 py-4">
        <span className="font-bold text-xl">
          Total Participants: {participants}
        </span>
        <button onClick={handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`hover:bg-white px-2 py-2 rounded-full w-10 h-10 transition-transform duration-300 ${
              rotate ? 'rotate-45' : ''
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
          <p className="py-4 text-3xl">Call your friends!! 📩</p>
          <p className="py-2 text-xl">You can share this invite link.</p>
          <Link className="py-2 text-xl wrap">
            https://www.planit.com/event/04
          </Link>
        </div>
      )}
      {/* Fetch and change the data over here */}
      <Box
        display={'flex'}
        gap={4}
        className="flex md:flex-row flex-col justify-start items-center bg-background-extralight my-4 md:px-8 py-4 text-center md:text-left"
      >
        <p className="image">
          <img
            src={image}
            width={70}
            height={70}
            className="border-2 border-primary-light rounded-full"
          />
        </p>
        <p className="">
          <span className="font-semibold text-xl">
            Mayank Surname {/** {name} */}
          </span>
          {renderRole('host')}
          {/** {renderRole({role})} */}
          <br />
          <span className="font-medium text-md text-primary-dull">
            Joined on 24 May, 2024{/** {date} */}
          </span>
        </p>
      </Box>
      {/*********************************************************** */}
      {/** Box 2  Delete all of this */}
      <Box
        display={'flex'}
        gap={4}
        className="flex justify-start items-center bg-background-extralight my-4 md:px-8 py-4"
      >
        <p className="image">
          <img
            src={image}
            width={70}
            height={70}
            className="border-2 border-primary-light rounded-full"
          />
        </p>
        <p className="">
          <span className="font-semibold text-xl">
            Arghya Studio {/** {name} */}
          </span>
          {renderRole('vendor')}
          {/** {role} */}
          <br />
          <span className="font-medium text-md text-primary-dull">
            Joined on 24 May, 2024{/** {date} */}
          </span>
        </p>
      </Box>
      {/** Box 3 */}
      <Box
        display={'flex'}
        gap={4}
        className="flex justify-start items-center bg-background-extralight my-4 md:px-8 py-4"
      >
        <p className="image">
          <img
            src={image}
            width={70}
            height={70}
            className="border-2 border-primary-light rounded-full"
          />
        </p>
        <p className="">
          <span className="font-semibold text-xl">
            Saakshi Raut{/** {name} */}
          </span>
          {renderRole('guest')}
          {/** {role} */}
          <br />
          <span className="font-medium text-md text-primary-dull">
            Joined on 24 May, 2024{/** {date} */}
          </span>
        </p>
      </Box>
    </div>
  )
}

export default Participants
