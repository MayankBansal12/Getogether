// This is the form to create an Event
import React, { useState } from 'react'
import Button from '../button'
import { Link } from '@mui/material'

const CreateEvent = () => {
  const [invite, setInvite] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    setInvite('https://www.google.com')
    console.log('Event created')
  }
  return (
    <>
      <div className="flex justify-center items-center py-20 w-full h-full font-josefin">
        <div className="flex-row border-2 border-primary-light px-2 md:px-10 py-4 md:py-10 text-center">
          <p className="py-3 text-xl md:text-3xl font-bold">
            Create an Event
            <span className="text-lg md:text-2xl">🪩</span>
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
              type="text"
              placeholder="Event Name"
              name="name"
            />
            <p className="py-4">
              Generate an invite link and send it to your close ones ;)
            </p>
            <br />
            <Button onClick={() => {}} children={'Generate link'} />
          </form>
          <p className="py-4">Share the link among your guests.</p>
          <Link href="/">{invite}</Link>
        </div>
      </div>
    </>
  )
}

export default CreateEvent
