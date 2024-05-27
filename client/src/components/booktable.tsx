import React, { useState, useEffect } from 'react'
import Table from '../assets/table.svg'
import Button from './button'

const BookTable = () => {
  const [isMobile, setIsMobile] = useState(false)

  const handleResize = () => {
    // Check if the screen width is small (sm) or extra small (xs)
    setIsMobile(window.innerWidth < 768) // Tailwind's 'sm' breakpoint is at 640px and 'md' is at 768px
  }

  useEffect(() => {
    handleResize() // Initial check
    window.addEventListener('resize', handleResize) // Add event listener for resize
    return () => {
      window.removeEventListener('resize', handleResize) // Cleanup the event listener on component unmount
    }
  }, [])

  // Create an array of 25 table pairs
  const tables = Array.from({ length: 25 })

  return (
    <>
      <div className="px-4 py-6 font-josefin text-center">
        <p className="font-bold text-4xl">Book Your Table!</p>
        <p className="font-medium text-xl">
          Join us for a celebration to remember! We can't wait to celebrate with
          you at our special event! 🤗
        </p>
      </div>
      <div className="flex md:flex-row flex-col space-x-4">
        <div
          className={`grid justify-center items-center ${
            isMobile
              ? 'grid-cols-3 gap-2'
              : 'md:grid-cols-5 grid-cols-1 sm:grid-rows-1 md:grid-rows-5'
          }`}
        >
          {tables.map((_, index) => (
            <button className="border-2 hover:border-2 hover:bg-background-light focus:bg-[#DED9FF] mx-2 md:mx-4 my-2 md:my-4 px-2">
              <div key={index} className="flex justify-center items-center">
                {/* First Table */}
                <img
                  src={Table}
                  alt="Table"
                  className={`mx-2 ${isMobile ? 'size-6' : 'size-12'}`}
                />
                {/* Second Table Flipped Horizontally */}
                <img
                  src={Table}
                  alt="Flipped Table"
                  className={`mx-2 transform scale-x-[-1]  ${
                    isMobile ? 'size-6' : 'size-12'
                  }`}
                />
              </div>
            </button>
          ))}
          <button
            disabled
            className="flex justify-center items-center border-2 border-gray-300 hover:border-gray-300 bg-gray-200 mx-2 md:mx-4 my-2 md:my-4 px-2 text-gray-500 cursor-not-allowed"
          >
            <img
              src={Table}
              alt="Table"
              className={`mx-2 ${isMobile ? 'w-6 h-6' : 'size-12'}`}
            />
            <img
              src={Table}
              alt="Flipped Table"
              className={`mx-2 transform scale-x-[-1] ${
                isMobile ? 'w-6 h-6' : 'size-12'
              }`}
            />
          </button>
        </div>
        <div className="flex justify-center items-center px-4 py-4 font-josefin">
          <p className="text-center">
            <span className="text-2xl">
              Just click on the following <br /> button and book your seat.
            </span>
            <br />
            <input
              className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-56 md:min-w-56 focus:outline-none text-md"
              type="text"
              placeholder="Your Name"
              name="name"
            />
            <input
              className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-56 md:min-w-56 focus:outline-none text-md"
              type="number"
              placeholder="Family Members"
              name="members"
            />
            <br />
            <Button onClick={() => {}} children={'+ Book'} />
          </p>
        </div>
      </div>
    </>
  )
}

export default BookTable
