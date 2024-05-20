import React from 'react'
import monkey from '../assets/monkey.png'
import bday from '../assets/bday.png'
import EventBox from '../components/eventbox'
import Button from '../components/button'

// This is where the user will be redirected after login
const AllEvents = () => {
  return (
    <>
      <div className="container w-full flex-col justify-center items-center h-full font-josefin py-10 ">
        <div className="flex flex-col justify-center items-center p-4 rounded-lg my-6">
          <img
            src={monkey}
            width={100}
            className="border-4 border-primary-light rounded-2xl mb-2"
          />
          <span>saakshiraut28@gmail.com</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <EventBox
            image={bday}
            title={`Mayank's Bday`}
            date={'25 Aug 2024'}
            host={'Mayank'}
          />
          <EventBox
            image={bday}
            title={`Mayank's Bday`}
            date={'25 Aug 2024'}
            host={'Mayank'}
          />
        </div>
        <div className="w-full flex items-center justify-center my-4 ">
          <Button
            onClick={() => {
              console.log('hello')
            }}
            children={'+ Create Event'}
          />
        </div>
      </div>
    </>
  )
}

export default AllEvents
