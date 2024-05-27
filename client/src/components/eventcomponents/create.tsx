// This is the form to create an Event
import React, { useState } from 'react'
import Button from '../button'
import { Link } from '@mui/material'
import ImageUploader from '../image-uploader'
import useAlert from '../../hooks/use-alert'
import useSnackbar from '../../hooks/use-snackbar'
import ImageHelper from '../../services/image'
import StepsPanes from './steps-panes'
import FormModal from '../form-modal'

interface EventDetails {
  target: {
    image: HTMLInputElement
    name: HTMLInputElement
    budget: HTMLInputElement
    desc: HTMLTextAreaElement
  }
}

const CreateEvent = () => {
  const newDate = new Date()
  const setSnackbar = useSnackbar()
  const [eventData, seteventData] = useState<null | {
    name: string
    image: string
    budget: number
    desc: string
  }>(null)
  // }>({ name: 'shadi', image: '' })
  const [showModal, setshowModal] = useState(false)
  const [subEvents, setSubEvents] = useState<
    { name: string; venue: string; startTime: Date; endTime: Date }[]
  >([
    { name: 'Mehendi', venue: 'Delhi', startTime: newDate, endTime: newDate },
    { name: 'Haldi', venue: 'Delhi', startTime: newDate, endTime: newDate },
    {
      name: 'Engagement',
      venue: 'Delhi',
      startTime: newDate,
      endTime: newDate,
    },
    {
      name: 'Reception',
      venue: 'Delhi',
      startTime: newDate,
      endTime: newDate,
    },
  ])
  const [subEventsSelected, setSubEventsSelected] = useState(false)

  const handleEventDetails = async (
    e: React.FormEvent<HTMLFormElement> & EventDetails,
  ) => {
    e.preventDefault()
    try {
      const name = e.target.name.value
      const image = e.target.image.files[0]
      const budget = Number(e.target.budget.value)
      const desc = e.target.desc.value
      if (
        !name ||
        !image ||
        !budget ||
        !desc ||
        name.length < 1 ||
        desc.length < 1
      ) {
        setSnackbar({
          open: true,
          content: 'Please fill all the details',
          type: 'info',
        })
        return
      }
      const img = (await ImageHelper.ConvertBase64(image)) as string
      seteventData({ name, budget, image: img, desc })
      setshowModal(true)
    } catch (error) {
      console.log(error)
      setSnackbar({
        open: true,
        content: 'Error creating event',
        type: 'error',
      })
    }
  }

  const changeSubEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newSubEvents = [...subEvents]
    newSubEvents[index].name = e.target.value
    setSubEvents(newSubEvents)
  }

  const delSubEvent = (index: number) => {
    const newSubEvents = [...subEvents]
    newSubEvents.splice(index, 1)
    setSubEvents(newSubEvents)
  }

  return (
    <>
      <div className="flex justify-center items-center px-14 py-20 w-full h-screen font-josefin">
        {!subEventsSelected ? (
          <div className="flex-row border-2 border-primary-light px-2 md:px-10 py-4 md:py-10 text-center">
            <p className="py-3 font-bold text-xl md:text-3xl">
              Create an Event
              <span className="text-lg md:text-2xl">🪩</span>
            </p>
            <form
              onSubmit={handleEventDetails}
              encType="multipart/form-data"
              className="flex flex-col"
            >
              <div className="flex flex-row justify-center mb-3">
                <ImageUploader label="Upload an Image" />
              </div>
              <input
                className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                type="text"
                placeholder="Event Name"
                name="name"
              />
              <input
                className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
                type="number"
                placeholder="Total Budget in ₹"
                name="budget"
              />
              <textarea
                name="desc"
                placeholder="Description"
                className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 focus:outline-none"
              ></textarea>
              <p className="py-4">
                This might be the beginning of something big {';)'}
              </p>
              <Button onClick={() => {}} children={'Create'} />
            </form>
            {showModal && (
              <FormModal
                open={showModal}
                setOpen={setshowModal}
                title={'Choose sub events'}
              >
                <div className="flex flex-col gap-4 w-96 h-60">
                  <div className="flex flex-col gap-4 h-full overflow-y-auto">
                    {subEvents.map((subEvent, index) => (
                      <div key={index} className="flex flex-row gap-6">
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => delSubEvent(index)}
                        />
                        <label className="flex flex-row gap-1">
                          <input
                            type="text"
                            value={subEvent.name}
                            onChange={(e) => changeSubEvent(e, index)}
                          />
                          <p>✏️</p>
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSubEvents((prev) => [
                        ...prev,
                        {
                          name: 'Event',
                          venue: 'Delhi',
                          startTime: newDate,
                          endTime: newDate,
                        },
                      ])
                    }
                    className="bg-primary-light ml-auto px-2 py-1 rounded-md w-40 text-white"
                  >
                    Add Sub Event ➕
                  </button>
                  {subEvents.length > 0 && (
                    <div className="flex flex-row gap-20 ml-auto">
                      <button
                        onClick={() => {
                          setshowModal(false)
                        }}
                        children={'Cancel'}
                        className="bg-primary-dull px-3 py-1 rounded-md text-white"
                      />
                      <button
                        onClick={() => {
                          setSubEventsSelected(true)
                          setshowModal(false)
                        }}
                        children={'Create'}
                        className="bg-primary-light px-3 py-1 rounded-md text-white"
                      />
                    </div>
                  )}
                </div>
              </FormModal>
            )}
          </div>
        ) : (
          <div className="flex flex-col border-2 border-primary-light px-5 py-2 w-full h-full">
            <StepsPanes
              subEvents={subEvents}
              setSubEvents={setSubEvents}
              eventData={eventData}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default CreateEvent
