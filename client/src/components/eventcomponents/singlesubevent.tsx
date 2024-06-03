import { useEffect, useState } from 'react'
import { Box, Divider, Modal } from '@mui/material'
import Button from '../button'
import { getDate } from '../../helpers/formatDate'
import useApi from '../../hooks/use-api'
import { useChannelStore } from '../../global-store/store'
import useAlert from '../../hooks/use-alert'
import useSnackbar from '../../hooks/use-snackbar'
import { useParams } from 'react-router-dom'

const SingleSubEvent = ({ channel }) => {
  const [setAlert, closeAlert] = useAlert();
  const callApi = useApi();
  const { eventId } = useParams();
  const setSnackbar = useSnackbar();
  const { setChannel } = useChannelStore();
  const [newGroup, setNewGroup] = useState({
    id: "",
    name: "",
    desc: ""
  })
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleEditOpen = () => setEditOpen(true)
  const handleEditClose = () => {
    setEditOpen(false)
    setNewGroup({
      id: "",
      name: "",
      desc: ""
    })
  }

  const createGroup = async (e, isEdit = false) => {
    e.preventDefault()
    try {
      if (
        !newGroup.name ||
        !newGroup.desc ||
        !eventId ||
        !channel.id
      ) {
        setSnackbar({
          open: true,
          content: 'Please fill all the details',
          type: 'info',
        })
        return
      }

      let uri = '/channel/group/create'
      let method = 'POST'

      if (isEdit) {
        uri = '/group'
        method = 'PUT'
      }

      const res = await callApi(uri, method, {
        name: newGroup.name,
        desc: newGroup.desc,
        eventId: Number(eventId),
        channelId: Number(channel.id),
        groupId: Number(newGroup.id),
      })

      if (res.status === 201) {
        setNewGroup({
          id: "",
          name: "",
          desc: ""
        })
        setSnackbar({
          open: true,
          content: isEdit ? 'Group Details edited!' : 'Group created!',
          type: 'success',
        })
        if (!isEdit) window.location.reload();
      } else {
        setSnackbar({
          open: true,
          content: 'Error while performing the action for group!',
          type: 'error',
        })
      }
      handleEditClose()
      handleClose()
    } catch (error) {
      console.log(error)
      setSnackbar({
        open: true,
        content: 'Error while performing the action for group!',
        type: 'error',
      })
    }

  }

  const handleDelete = async (group) => {
    console.log('Deleted!', group)
    if (!group) {
      setSnackbar({
        open: true,
        content: 'Error, try again after refreshing the page!',
        type: 'warning',
      })
      return
    }
    try {
      const res = await callApi('/group', 'DELETE', {
        groupId: Number(group.groupId),
        eventId: Number(eventId)
      })
      if (res.status === 200) {
        setSnackbar({
          open: true,
          content: 'Group deleted!',
          type: 'success',
        })
      } else {
        setSnackbar({
          open: true,
          content: 'Error deleting group, try again!',
          type: 'error',
        })
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        content: 'Error deleting group, try again!',
        type: 'error',
      })
    }
    closeAlert()
  }

  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      <Box
        display={'flex'}
        gap={2}
        className="flex flex-col bg-background-extralight my-4 px-4 md:px-8 py-8 rounded-md"
      >
        <div className="flex md:flex-row flex-col justify-between items-center w-full">

          <p className="font-bold text-center text-xl">{channel?.name}</p>

          <div className="flex px-2 py-1 border border-black rounded-full">
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
            <span>{channel?.ChannelParticipant?.length || 0} People</span>
          </div>
        </div>

        <p className="font-xl text-black text-md">{channel?.desc}</p>

      </Box>

      <Box
        display={'flex'}
        gap={2}
        className="md:flex-row flex-col justify-between my-4 w-full"
      >
        <div className="flex-1 bg-background-extralight px-4 md:px-12 py-4 md:py-8 rounded-md text-center">
          <p className="py-2 font-bold text-xl underline">Venue</p>
          <p className="font-medium text-lg">{channel?.venue}</p>
        </div>
        <div className="flex-1 bg-background-extralight px-4 md:px-12 py-4 md:py-8 rounded-md text-center">
          <p className="py-2 font-bold text-xl underline">Time</p>
          <p className="font-medium text-lg">{`${getDate(
            channel?.startTime,
          )} - ${getDate(channel?.endTime)}`}</p>

        </div>
      </Box>

      {/* Group Section */}
      <Box
        display={'flex'}
        gap={2}
        className="flex flex-col bg-background-extralight my-4 px-4 md:px-8 py-4 rounded-md"
      >
        <div className="flex md:flex-row flex-col justify-between items-center">
          <span className="font-bold text-xl">Groups</span>
          <Button onClick={handleOpen} children={'+ Add Group'} />
        </div>
        <Divider />

        <Modal
          open={open}
          onClose={handleClose}
          className="flex justify-center items-center"
        >
          <Box className="flex flex-col gap-2 bg-white px-4 py-4 rounded-md w-1/2 h-fit">
            <h2 className="font-semibold text-lg">Create Group</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 pt-1 pb-4">
                <h2>
                  Create groups for managing messages inside your channel
                </h2>
                <h3>
                  All participants who are part of channel will be able to message except for groups named (Announcements, Vendor) which are specific to user role
                </h3>
              </div>
              <form
                className="flex flex-col justify-center items-center gap-4 w-full"
                onSubmit={createGroup}
              >
                <input
                  placeholder="Group Name Eg. #general"
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-2/3 text-[18px] focus:outline-none"
                  type="text"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
                <textarea
                  placeholder="Group Desc Eg. General group"
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-2/3 h-[100px] text-[18px] focus:outline-none"
                  value={newGroup.desc}
                  onChange={(e) =>
                    setNewGroup((prev) => ({ ...prev, desc: e.target.value }))
                  }
                  required
                />
                <button className="bg-primary-light my-3 px-3 py-2 rounded-md w-1/5 text-white">
                  Create
                </button>
              </form>
            </div>
          </Box>
        </Modal>

        <Modal
          open={editOpen}
          onClose={handleEditClose}
          className="flex justify-center items-center"
        >
          <Box className="flex flex-col gap-2 bg-white px-4 py-4 rounded-md w-1/2 h-fit">
            <h2 className="mb-4 font-semibold text-lg">Edit Group</h2>
            <div className="flex flex-col gap-4">
              <form
                className="flex flex-col justify-center items-center gap-4 w-full"
                onSubmit={(e) => createGroup(e, true)}
              >
                <input
                  placeholder="Group Name Eg. #general"
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-2/3 text-[18px] focus:outline-none"
                  type="text"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
                <textarea
                  placeholder="Group Desc Eg. General group"
                  className="border-primary-light bg-background-light my-1 px-2 py-1 border-b focus:border-b-2 w-2/3 h-[100px] text-[18px] focus:outline-none"
                  value={newGroup.desc}
                  onChange={(e) =>
                    setNewGroup((prev) => ({ ...prev, desc: e.target.value }))
                  }
                  required
                />
                <button className="bg-primary-light my-3 px-3 py-2 rounded-md w-1/5 text-white">
                  Edit
                </button>
              </form>
            </div>
          </Box>
        </Modal>

        {channel?.GroupRelation?.map(item => (
          <div className="flex md:flex-row flex-col justify-between text-center" key={item.id}>
            <span className="font-medium text-lg">#{item?.Group?.name.toLowerCase()}</span>
            <div className="flex gap-1">
              <button
                className="hover:text-gray-500 transition-all cursor-pointer"
                onClick={() => {
                  setNewGroup(item.Group);
                  handleEditOpen();
                }}
              >
                Edit
              </button>
              <span>|</span>
              <button
                className="hover:text-gray-500 transition-all cursor-pointer"
                onClick={() => setAlert({
                  open: true,
                  title: `Are you sure you want to delete ${item?.Group?.name} group?`,
                  text: "All messages will be deleted and won't be recovered later!",
                  primaryButton: 'Yes',
                  primaryAction: () => {
                    handleDelete(item)
                  },
                  secondaryButton: 'No',
                  secondaryAction: () => closeAlert()
                })}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </Box>
    </div>
  )
}

export default SingleSubEvent
