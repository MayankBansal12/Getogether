// This is the form to create an Event
import React, { useState } from 'react'
import Button from '../button'
import { Link, Checkbox } from '@mui/material'
import { Add } from '@mui/icons-material'
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
    image?: string
    budget?: number
    desc: string
  }>(null)

  const [showModal, setshowModal] = useState(false)
  const [subEvents, setSubEvents] = useState<
    { name: string; venue: string; startTime: Date; endTime: Date }[]
  >([
    {
      name: 'Sub Event 1',
      venue: 'Delhi',
      startTime: newDate,
      endTime: newDate,
    },
    {
      name: 'Sub Event 2',
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
      const image = e.target?.image.files[0]
      // const budget = Number(e.target.budget.value)
      const desc = e.target.desc.value
      if (!name || !desc || name.length < 1 || desc.length < 1) {
        
        
        return
      }
      let img = ''
      if (image) img = (await ImageHelper.ConvertBase64(image)) as string
      seteventData({ name, image: img, desc })
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
    <div className="flex justify-center items-center px-14 py-20 w-full h-screen font-josefin">
      {!subEventsSelected ? (
        <div className="flex flex-col justify-center items-center border-2 border-primary-light px-2 md:px-10 py-4 md:py-10 w-2/3 h-[90vh] text-center">
          <p className="text-xl md:text-3xl">
            Create an{' '}
            <span className="font-title text-3xl md:text-5xl">
              #<span className="text-primary-light">event.</span>
              <span className="text-lg md:text-2xl">🪩</span>
            </span>
          </p>
          <div className="pt-1 pb-4">
            <h1>#Let's get you started with the event!</h1>
            <h2>Fill up all the details as asked</h2>
          </div>
          <form
            onSubmit={handleEventDetails}
            encType="multipart/form-data"
            className="flex flex-col items-center my-2"
          >
            <div className="flex flex-row justify-center mb-3">
              <ImageUploader label="Upload an Image" />
            </div>
            <input
              className="border-primary-light bg-background-light my-1 mt-2 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 text-[18px] focus:outline-none"
              type="text"
              placeholder="Event Name"
              name="name"
              required
            />
            {/* <input
              className="border-primary-light bg-background-light my-1 mt-2 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 text-[18px] focus:outline-none"
              type="number"
              placeholder="Total Budget in ₹"
              name="budget"
            /> */}
            <textarea
              name="desc"
              placeholder="Description"
              className="border-primary-light bg-background-light my-1 mt-2 px-2 py-1 border-b focus:border-b-2 min-w-60 md:min-w-80 text-[18px] focus:outline-none"
              required
            />
            <br />
            <p className="py-4">
              Want to go back to joining events?
              <br />
              <Link href="/allEvents"> @See Events List.</Link>
            </p>
            <Button onClick={() => {}} children={'Next'} />
          </form>
          {showModal && (
            <FormModal
              open={showModal}
              setOpen={setshowModal}
              title={'Create sub events'}
            >
              <div className="flex flex-col gap-4 w-full h-full font-josefin font-medium">
                <div className="flex flex-col gap-1">
                  <h2>
                    Sub events are a great way to divide your whole event into
                    sub parts and organizing each sub event with their
                    respective participants seperately.
                  </h2>
                  <h3>Atleast one sub event is needed to continue forward!</h3>
                </div>
                <div className="flex justify-between">
                  <span>
                    {eventData.name.substring(0, 200) + '..'}Total Sub Events:{' '}
                    {subEvents.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setSubEvents((prev) => [
                        ...prev,
                        {
                          name: 'New SubEvent',
                          venue: 'Delhi',
                          startTime: newDate,
                          endTime: newDate,
                        },
                      ])
                    }
                    className="flex items-center gap-1 bg-primary-light ml-auto px-2 py-1 rounded-md w-40 text-white"
                  >
                    <Add /> Add Sub Event
                  </button>
                </div>
                <div className="flex flex-col gap-2 w-full max-h-[320px] overflow-y-scroll">
                  {subEvents.map((subEvent, index) => (
                    <div key={index} className="flex flex-row gap-2">
                      <Checkbox
                        checked={true}
                        onChange={() => delSubEvent(index)}
                      />
                      <label className="flex flex-row justify-center items-center gap-3">
                        <input
                          className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-[30vw] text-[18px] focus:outline-none"
                          type="text"
                          value={subEvent.name}
                          onChange={(e) => changeSubEvent(e, index)}
                          required
                        />
                        <p className="cursor-pointer">✏️</p>
                      </label>
                    </div>
                  ))}
                </div>
                {subEvents.length > 0 && (
                  <div className="flex flex-row justify-between mt-2">
                    <button
                      onClick={() => {
                        setshowModal(false)
                      }}
                      children={'Cancel'}
                      className="px-3 py-1 border border-black rounded-md"
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
        <div className="flex flex-col justify-center items-center border-2 border-primary-light px-4 py-2 w-2/3 h-[85vh]">
          <StepsPanes
            subEvents={subEvents}
            setSubEvents={setSubEvents}
            eventData={eventData}
          />
        </div>
      )}
    </div>
  )
}

export default CreateEvent
