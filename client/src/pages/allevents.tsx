import React, { useEffect, useState } from 'react'
import monkey from '../assets/monkey.png'
import bday from '../assets/bday.png'
import EventBox from '../components/eventcomponents/eventbox'
import Button from '../components/button'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../global-store/store'

const BACKEND = import.meta.env.VITE_SERVER || 'http://localhost:5000'

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
    <div className="flex flex-col justify-center items-center gap-4 py-10 w-full h-screen font-josefin">
      <div className="font-title text-3xl md:text-5xl">
        Get
        <span className="text-primary-light">ogether.</span>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 p-4 rounded-lg">
        <img
          src={user.profilePic || monkey}
          className="border-4 border-primary-light rounded-2xl w-[130px] h-[125px]"
          alt={user.name + ' profile pic'}
        />
        <span>{user.name}</span>
      </div>
      <div className="flex flex-col overflow-y-scroll">
        {AllEvents.length > 0 ? (
          AllEvents.map((event, index) => (
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
                navigate('/event/' + event.id)
              }}
            />
          ))
        ) : (
          <div className="flex flex-col mb-3 font-medium text-center text-md md:text-lg">
            <span>No Events to show!</span>
            <span> Wait till you are invited to @join any </span>
            <span>or create your own #event.</span>
          </div>
        )}
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
  )
}

export default AllEvents
