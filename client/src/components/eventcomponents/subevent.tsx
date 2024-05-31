// This component lists all the subevent
import React, { useEffect, useState } from 'react'
import { Box, Modal } from '@mui/material'
import { Add, Preview } from "@mui/icons-material"
import { useNavigate, useParams } from 'react-router-dom'
import Datepicker from 'react-tailwindcss-datepicker'
import { ChannelType } from "../../global-types/model"
import { getDate } from '../../helpers/formatDate'
import useApi from '../../hooks/use-api'
import useSnackbar from '../../hooks/use-snackbar'
import useAlert from '../../hooks/use-alert'
import { useChannelStore } from '../../global-store/store'

// interface SubeventsProps {
//   channels: ChannelType[];
// }

const Subevents = () => {
  const navigate = useNavigate()
  const { eventId } = useParams();
  const { channel, setChannel } = useChannelStore(state => state)
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const setSnackbar = useSnackbar();
  const [setAlert, closeAlert] = useAlert();
  const [subEvent, setSubEvent] = useState({
    name: "",
    desc: "",
    venue: "",
    startTime: "",
    endTime: ""
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => {
    setEditOpen(false)
    setSubEvent({
      name: "",
      desc: "",
      venue: "",
      startTime: "",
      endTime: ""
    });
  };

  const openDelete = (item: ChannelType) => {
    setAlert({
      open: true,
      title: `Delete sub event @${item?.name}`,
      text: 'Would you like to delete the sub event?',
      primaryButton: 'Confirm',
      secondaryButton: 'Cancel',
      primaryAction: () => {
        deleteSubEvent(item)
      },
      secondaryAction: () => {
        closeAlert()
      },
    })
  }

  const handleDateChange = (newValue) => {
    console.log('newValue:', newValue)
    const newSubEvent = { ...subEvent }
    newSubEvent['startTime'] = newValue.startDate
    newSubEvent['endTime'] = newValue.endDate
    setSubEvent(newSubEvent)
  }

  const createSubEvent = async (e, isEdit = false) => {
    try {
      e.preventDefault();
      if (!subEvent.name || !subEvent.desc || !subEvent.venue || !subEvent.startTime || !subEvent.endTime || subEvent.startTime === '' || subEvent.endTime === '') {
        setSnackbar({
          open: true,
          content: 'Please fill all the details',
          type: 'info',
        })
        return;
      }

      let uri = "/event/channel/create";
      let method = "POST";

      if (isEdit) {
        uri = "/channel"
        method = "PUT"
      }

      const res = await useApi(uri, method, { ...subEvent, eventId: Number(eventId), channelId: Number(subEvent?.id || 0) })
      console.log(res);
      if (res.status === 201) {
        setSubEvent({
          name: "",
          desc: "",
          venue: "",
          startTime: "",
          endTime: ""
        })
        setSnackbar({
          open: true,
          content: isEdit ? 'Sub Event Details edited!' : 'Sub Event created!',
          type: 'success',
        })
        fetchChannelDetails();
      } else {
        setSnackbar({
          open: true,
          content: 'Error while performing the action for sub event!',
          type: 'error',
        })
      }
      handleEditClose();
      handleClose();
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        content: 'Error while performing the action for sub event!',
        type: 'error',
      })
    }
  }

  const deleteSubEvent = async (subEvent) => {
    console.log("Deleted!", subEvent);
    if (!subEvent) {
      setSnackbar({
        open: true,
        content: 'Error, try again after refreshing the page!',
        type: 'warning',
      })
      return;
    }
    const res = await useApi("/channel", "DELETE", { eventId: Number(eventId), channelId: subEvent?.id })
    if (res.status === 204) {
      setSnackbar({
        open: true,
        content: 'Sub Event deleted!',
        type: 'success',
      })
      fetchChannelDetails();
    } else {
      setSnackbar({
        open: true,
        content: 'Error deleting sub event!',
        type: 'error',
      })
    }
    closeAlert();
  }

  const fetchChannelDetails = async () => {
    try {
      const res = await useApi("/event/list", "POST", { eventId: Number(eventId), includeGroup: true })
      if (res.status === 200) {
        setChannel(res?.data?.events?.Channel)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchChannelDetails();
  }, [])

  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      <Box className="flex justify-between items-center bg-background-extralight my-4 px-4 md:px-6 py-4">
        <span className="font-bold text-xl">Total Sub Events: {channel?.length}</span>
        <button
          type="button"
          className="bg-primary-light hover:bg-transparent border transition-all hover:text-black hover:border-black ml-auto px-2 py-1 rounded-md w-40 text-white flex items-center gap-1"
          onClick={handleOpen}
        >
          <Add /> Add Sub Event
        </button>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center"
      >
        <Box className="w-3/4 h-fit bg-white px-4 py-4 flex flex-col gap-2 rounded-md">
          <h2 className="text-lg font-semibold">Create Sub Event</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 pt-1 pb-4">
              <h2>You can add different event participants and groups for each sub event.</h2>
              <h3>Default groups will be created which include groups for Announcements, Vendor, General and Photos</h3>
            </div>
            <form className="flex flex-col gap-4 w-full justify-center items-center" onSubmit={createSubEvent}>
              <input
                placeholder="Sub Event Name Eg. Reception"
                className="border-primary-light bg-background-light text-[18px] w-2/3 my-1 px-2 py-1 border-b focus:border-b-2 focus:outline-none"
                type="text"
                value={subEvent.name}
                onChange={(e) => setSubEvent(prev => ({ ...prev, "name": e.target.value }))}
                required
              />
              <textarea
                placeholder="Sub Event Description Eg. For the reception"
                className="border-primary-light bg-background-light text-[18px] w-2/3 h-[100px] my-1 px-2 py-1 border-b focus:border-b-2 focus:outline-none"
                value={subEvent.desc}
                onChange={(e) => setSubEvent(prev => ({ ...prev, "desc": e.target.value }))}
                required
              />
              <input
                placeholder="Sub Event Venue Eg. Party Hall, Delhi, India"
                className="border-primary-light bg-background-light text-[18px] w-2/3 my-1 px-2 py-1 border-b focus:border-b-2 focus:outline-none"
                type="text"
                value={subEvent.venue}
                onChange={(e) => setSubEvent(prev => ({ ...prev, "venue": e.target.value }))}
                required
              />
              <div className="flex flex-col w-2/3">
                <h2 className="my-3">Select start and end dates</h2>
                <Datepicker
                  value={{
                    startDate: subEvent.startTime,
                    endDate: subEvent.endTime,
                  }}
                  onChange={handleDateChange}
                  showShortcuts={true}
                />
              </div>
              <button
                className="bg-primary-light px-3 py-2 my-3 w-1/5 rounded-md text-white">Create</button>
            </form>
          </div>
        </Box>
      </Modal>

      <Modal
        open={editOpen}
        onClose={handleEditClose}
        className="flex justify-center items-center"
      >
        <Box className="w-3/4 h-fit bg-white px-4 py-4 flex flex-col gap-2 rounded-md">
          <h2 className="text-lg mb-4 font-semibold">Edit Sub Event</h2>
          <div className="flex flex-col gap-4">
            <form className="flex flex-col gap-4 w-full justify-center items-center" onSubmit={(e) => createSubEvent(e, true)}>
              <input
                placeholder="Sub Event Name Eg. Reception"
                className="border-primary-light bg-background-light text-[18px] w-2/3 my-1 px-2 py-1 border-b focus:border-b-2 focus:outline-none"
                type="text"
                value={subEvent.name}
                onChange={(e) => setSubEvent(prev => ({ ...prev, "name": e.target.value }))}
                required
              />
              <textarea
                placeholder="Sub Event Description Eg. For the reception"
                className="border-primary-light bg-background-light text-[18px] w-2/3 h-[100px] my-1 px-2 py-1 border-b focus:border-b-2 focus:outline-none"
                value={subEvent.desc}
                onChange={(e) => setSubEvent(prev => ({ ...prev, "desc": e.target.value }))}
                required
              />
              <input
                placeholder="Sub Event Venue Eg. Party Hall, Delhi, India"
                className="border-primary-light bg-background-light text-[18px] w-2/3 my-1 px-2 py-1 border-b focus:border-b-2 focus:outline-none"
                type="text"
                value={subEvent.venue}
                onChange={(e) => setSubEvent(prev => ({ ...prev, "venue": e.target.value }))}
                required
              />
              <div className="flex flex-col w-2/3">
                <h2 className="my-3">Select start and end dates</h2>
                <Datepicker
                  value={{
                    startDate: subEvent.startTime,
                    endDate: subEvent.endTime,
                  }}
                  onChange={handleDateChange}
                  showShortcuts={true}
                />
              </div>
              <button
                className="bg-primary-light px-3 py-2 my-3 w-1/5 rounded-md text-white">Edit</button>
            </form>
          </div>
        </Box>
      </Modal>

      {channel && channel.length <= 0 ? <div className="text-center">No sub events listed!</div> :
        channel?.map(item => (
          <Box
            key={item.id}
            display={'flex'}
            gap={4}
            className="flex md:flex-row flex-col justify-between items-center border-2 border-transparent hover:border-primary-light bg-background-extralight hover:bg-white rounded-md transition-all my-2 px-4 md:px-6 py-2"
          >
            <div className="text-center md:text-left">
              <p className="font-semibold text-xl">
                {"@ " + item.name.toLowerCase()}
              </p>
              <p className="font-medium text-md text-primary-dull">
                {getDate(item.startTime)} - {getDate(item.endTime)}
              </p>
            </div>
            <div className="text-center flex flex-col items-center gap-1">
              <div className="flex justify-center items-center px-2 py-1 border border-black rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mx-2 w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                <span>{item.ChannelParticipant?.length || 0} People</span>
              </div>
              <div className="flex gap-1">
                <button className="hover:text-gray-500 transition-all cursor-pointer" onClick={() => { setSubEvent(item); handleEditOpen() }}>Edit</button>
                <span>|</span>
                <button className="hover:text-gray-500 transition-all cursor-pointer" onClick={() => openDelete(item)}>Delete</button>
              </div>
            </div>
          </Box>
        ))
      }
    </div>
  )
}
export default Subevents
