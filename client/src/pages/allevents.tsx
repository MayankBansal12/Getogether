import React from 'react'
import monkey from '../assets/monkey.png'
import bday from '../assets/bday.png'
import EventBox from '../components/eventcomponents/eventbox'
import Button from '../components/button'
import { useNavigate } from 'react-router-dom'

// This is where the user will be redirected after login
const AllEvents = () => {
  const navigate = useNavigate()
  return (
    <>
      <div className="flex-col justify-center items-center py-10 w-full h-full font-josefin container">
        <div className="flex flex-col justify-center items-center my-6 p-4 rounded-lg">
          <img
            src={monkey}
            width={100}
            className="border-4 border-primary-light mb-2 rounded-2xl"
          />
          <span>saakshiraut28@gmail.com</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <EventBox
            image={bday}
            title={`Mayank's Bday`}
            date={'25 Aug 2024'}
            host={'Mayank'}
            onClick={() => {
              navigate('/dashboard')
            }}
          />
          <EventBox
            image={bday}
            title={`Mayank's Bday`}
            date={'25 Aug 2024'}
            host={'Mayank'}
            onClick={() => {
              navigate('/dashboard')
            }}
          />
        </div>
        <div className="flex justify-center items-center my-4 w-full">
          <Button
            onClick={() => {
              navigate('/dashboard')
            }}
            children={'+ Create Event'}
          />
        </div>
      </div>
    </>
  )
}

export default AllEvents
