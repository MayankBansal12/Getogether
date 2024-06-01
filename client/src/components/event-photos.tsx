import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import PageNotFound from '../pages/page-not-found'
import { useEventStore } from '../global-store/store'

type Props = {}

const EventPhotos = (props: Props) => {
  const { eventId } = useParams()
  const event = useEventStore((state) => state.event)
  const [selectedBtn, setselectedBtn] = useState<'all' | 'mine'>('all')

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full h-[85vh]">
      <img src={event.image} alt="Event picture" className="w-20 h-20" />
      <p className="font-bold text-2xl">{event.name}</p>
      <div className="flex flex-row justify-center gap-6 mt-4 pb-6 border-b-2 w-full">
        <button
          className={`px-4 py-2 rounded-md hover:bg-accent-light text-white ${
            selectedBtn === 'all' ? 'bg-primary-light' : 'bg-primary-dull'
          }`}
          onClick={() => setselectedBtn('all')}
        >
          All photos
        </button>
        <button
          className={`px-4 py-2 rounded-md hover:bg-accent-light text-white ${
            selectedBtn === 'mine' ? 'bg-primary-light' : 'bg-primary-dull'
          }`}
          onClick={() => setselectedBtn('mine')}
        >
          My Photos
        </button>
      </div>
      <div className="justify-center items-center gap-2 grid grid-cols-3 w-1/2 h-full overflow-y-auto"></div>
    </div>
  )
}

export default EventPhotos
