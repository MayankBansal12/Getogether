import React, { useEffect, useState } from 'react'
import monkey from '../assets/monkey.png'
import bday from '../assets/bday.png'
import EventBox from '../components/eventcomponents/eventbox'
import Button from '../components/button'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../global-store/store'

const BACKEND = 'http://localhost:5000'

interface SingleEvent {
  id: number
  name: string
  desc: string
  date: string
  hostId: number
  image: string
  Host: {
    name: string
    id: number
  }
}

// This is where the user will be redirected after login
const AllEvents = () => {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)
  const [AllEvents, setAllEvents] = useState<SingleEvent[]>([])

  async function FetchEvents() {
    try {
      const res = await fetch(`${BACKEND}/event/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await res.json()
      setAllEvents(data.events)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    FetchEvents()
  }, [])

  return (
    <>
      <div className="flex-col justify-center items-center py-10 w-full h-full font-josefin container">
        <div className="flex flex-col justify-center items-center my-6 p-4 rounded-lg">
          <img
            src={user.profilePic || monkey}
            width={100}
            className="border-4 border-primary-light mb-2 rounded-2xl"
          />
          <span>{user.name}</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          {AllEvents.map((event, index) => (
            <EventBox
              key={index}
              image={event.image.length > 0 ? event.image : bday}
              title={event.name}
              date={new Date(event.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              host={event.hostId === user.id ? 'You' : event.Host.name}
              onClick={() => {
                navigate('/dashboard')
              }}
            />
          ))}
        </div>
        <div className="flex justify-center items-center my-4 w-full">
          <Button
            onClick={() => {
              navigate('/createevent')
            }}
            children={'+ Create Event'}
          />
        </div>
      </div>
    </>
  )
}

export default AllEvents
