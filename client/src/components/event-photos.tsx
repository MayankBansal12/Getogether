import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEventStore, useUserStore } from '../global-store/store'
import ScreenLoader from './screen-loader'
import useSnackbar from '../hooks/use-snackbar'
import ImageHelper from '../services/image'
import ImageUploader from './image-uploader'
import Participants from './eventcomponents/participants'

const backend = 'http://localhost:5000'
interface AllEventPhotos {
  url: string
  id: number
  PhotoParticipant: {
    EventParticipant: {
      id: number
      userId: number
      name: string
    }
  }[]
}

const EventPhotos = () => {
  const { eventId } = useParams()
  const event = useEventStore((state) => state.event)
  const user = useUserStore((state) => state.user)
  const [selectedBtn, setselectedBtn] = useState<'all' | 'mine' | 'upload'>(
    'all',
  )
  const [allPhotos, setAllPhotos] = useState<null | AllEventPhotos[]>(null)
  const [myPhotos, setMyPhotos] = useState<null | AllEventPhotos[]>(null)
  const setSnackbar = useSnackbar()
  const [uploadingPhoto, setuploadingPhoto] = useState(false)

  useEffect(() => {
    console.log('myPhotos', myPhotos)
  }, [myPhotos])

  const fetchPhotos = async () => {
    try {
      const res = await fetch(backend + '/event/photos/' + eventId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const { data }: { data: AllEventPhotos[] } = await res.json()
      setAllPhotos(data)
      const photosMe = []
      data.forEach((photo) =>
        photo.PhotoParticipant.forEach((participants) => {
          if (participants.EventParticipant.userId === user.id) {
            photosMe.push(photo)
          }
        }),
      )
      setMyPhotos(photosMe)
    } catch (error) {
      console.log(error)
      setSnackbar({ open: true, content: 'Some error occurred', type: 'error' })
    }
  }

  const uploadPhotos = async (e) => {
    e.preventDefault()
    try {
      setuploadingPhoto(true)
      const image = e.target.image.files[0]
      const b64img = await ImageHelper.ConvertBase64(image)
      const res = await fetch(backend + '/event/add-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ image: b64img, eventId: event.id }),
      })
      setselectedBtn('all')
    } catch (error) {
      console.log(error)
      setSnackbar({ open: true, content: 'Some error occurred', type: 'error' })
    } finally {
      setuploadingPhoto(false)
    }
  }

  useEffect(() => {
    if (selectedBtn === 'all') {
      fetchPhotos()
    }
  }, [selectedBtn])

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
            selectedBtn === 'upload' ? 'bg-primary-light' : 'bg-primary-dull'
          }`}
          onClick={() => setselectedBtn('upload')}
        >
          Upload Photos
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

      {selectedBtn === 'all' && (
        <>
          {allPhotos && allPhotos.length > 0 && (
            <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-1/2 h-full overflow-y-auto">
              {allPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt={`photo${index}`}
                  className="w-[200px] h-[150px] object-cover"
                />
              ))}
            </div>
          )}
          {allPhotos && allPhotos.length === 0 && <p>No photos</p>}
          {!allPhotos && <ScreenLoader />}
        </>
      )}
      {selectedBtn === 'mine' && (
        <>
          {myPhotos && myPhotos.length > 0 && (
            <div className="flex flex-row flex-wrap justify-center items-center gap-2 w-1/2 h-full overflow-y-auto">
              {myPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo.url}
                  alt={`photo${index}`}
                  className="w-[200px] h-[150px] object-cover"
                />
              ))}
            </div>
          )}
          {myPhotos && myPhotos.length === 0 && <p>No photos</p>}
          {!myPhotos && <ScreenLoader />}
        </>
      )}
      {selectedBtn === 'upload' && (
        <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
          <form
            onSubmit={uploadPhotos}
            className="flex flex-col items-center gap-4"
          >
            <ImageUploader />
            <button
              disabled={uploadingPhoto}
              className="bg-primary-light hover:bg-primary-dull px-3 py-2 rounded-md text-white"
            >
              {uploadingPhoto ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default EventPhotos
