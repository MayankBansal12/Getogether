// This component is for the participants page. (On the host side)

import { Box } from '@mui/material'
import monkey from '../../assets/monkey.png'

const Participants = () => {
  //Dummy values. Delete this later
  const participants = 70
  const image = monkey

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
        className="flex justify-start items-center bg-background-extralight my-4 md:px-8 py-4"
      >
        <p className="image">
          <img src={image} width={70} height={70} className="rounded-full" />
        </p>
        <p className="">
          <span className="font-semibold text-xl">
            Mayank Surname {/** {name} */}
          </span>
          {renderRole('host')}
          {/** {renderRole({role})} */}
          <br />
          <span className="font-medium text-dull text-xl">
            Joined on 24 May, 2024{/** {date} */}
          </span>
        </p>
      </Box>
      {/** Box 2 */}
      <Box
        display={'flex'}
        gap={4}
        className="flex justify-start items-center bg-background-extralight my-4 md:px-8 py-4"
      >
        <p className="image">
          <img src={image} width={70} height={70} className="rounded-full" />
        </p>
        <p className="">
          <span className="font-semibold text-xl">
            Arghya Studio {/** {name} */}
          </span>
          {renderRole('vendor')}
          {/** {role} */}
          <br />
          <span className="font-medium text-dull text-xl">
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
          <img src={image} width={70} height={70} className="rounded-full" />
        </p>
        <p className="">
          <span className="font-semibold text-xl">
            Arghya Studio {/** {name} */}
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
