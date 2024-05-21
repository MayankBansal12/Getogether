import React from 'react'
import monkey from '../assets/monkey.png'
import bday from '../assets/bday.png'
import EventBox from '../components/eventcomponents/eventbox'
import Button from '../components/button'
import { useNavigate } from 'react-router-dom'
import { Box, Divider } from '@mui/material'

// This is where the user will be redirected after login
const CalenderEvent = () => {
  const navigate = useNavigate()
  return (
    <>
      <main className="mx-auto px-4 md:px-6 py-4 w-full max-w-4xl font-josefin">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight">
              Game Zone
            </h1>
            <p className="mt-2 text-primary-dull">
              June 15, 2023 | 7:00 PM - 11:00 PM
            </p>
            <p className="mt-2 text-primary-dull">
              Acme Event Center, 123 Main St, Anytown USA
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="font-bold text-2xl">Event Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">What to Bring ❓</h3>
                <p className="mt-2 text-black">
                  Please bring a valid ID for entry and any items specified on
                  the event agenda.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Dress Code 👕</h3>
                <p className="mt-2 text-black">
                  Formal attire is required. No jeans or t-shirts allowed.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Agenda 📌</h3>
                <ul className="space-y-2 mt-2 pl-6 text-black list-disc">
                  <li>7:00 PM - 8:00 PM: Cocktail Reception</li>
                  <li>8:00 PM - 9:00 PM: Dinner and Speeches</li>
                  <li>9:00 PM - 11:00 PM: Dancing and Networking</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="font-bold text-2xl">About the Host</h2>
            <div className="flex items-center gap-4">
              <img
                alt="Acme Inc. Logo"
                className="rounded-full"
                height={48}
                src="/placeholder.svg"
                style={{
                  aspectRatio: '48/48',
                  objectFit: 'cover',
                }}
                width={48}
              />
              <div>
                <h3 className="font-medium text-lg">Mayank</h3>
                <p className="mt-1 text-black">
                  Acme Inc. is a leading provider of innovative solutions for
                  businesses of all sizes. We are dedicated to helping our
                  clients achieve their goals and succeed in today's competitive
                  marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CalenderEvent
