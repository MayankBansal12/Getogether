import { useEffect, useState } from 'react'
import monkey from '../../assets/monkey.png'
import { Avatar, Box, Divider, Modal, Tab, Tabs } from '@mui/material'
import Button from '../button'
import { getDate } from '../../helpers/formatDate'
import useApi from '../../hooks/use-api'
import { useEventStore } from '../../global-store/store'
import useAlert from '../../hooks/use-alert'
import useSnackbar from '../../hooks/use-snackbar'
import { useParams } from 'react-router-dom'
import { renderRole } from '../../helpers/event'

const SingleSubEvent = ({ channel }) => {
  const [setAlert, closeAlert] = useAlert()
  const callApi = useApi()
  const { eventId } = useParams()
  const setSnackbar = useSnackbar()
  const { event } = useEventStore()
  const [newGroup, setNewGroup] = useState({
    id: '',
    name: '',
    desc: '',
  })
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [totalParticipants, setTotalParticipants] = useState([]);
  const [channelParticipants, setChannelParticipants] = useState([]);
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleEditOpen = () => setEditOpen(true)
  const handleEditClose = () => {
    setEditOpen(false)
    setNewGroup({
      id: '',
      name: '',
      desc: '',
    })
  }
  const [participantOpen, setParticipantOpen] = useState(false)
  const handleParticipantOpen = () => setParticipantOpen(true)
  const handleParticipantClose = () => setParticipantOpen(false)
  const [tabValue, setTabValue] = useState(0);

  const createGroup = async (e, isEdit = false) => {
    e.preventDefault()
    try {
      if (!newGroup.name || !newGroup.desc || !eventId || !channel.id) {
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
          id: '',
          name: '',
          desc: '',
        })
        setSnackbar({
          open: true,
          content: isEdit ? 'Group Details edited!' : 'Group created!',
          type: 'success',
        })
        if (!isEdit) window.location.reload()
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
        eventId: Number(eventId),
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
      console.log(error)
      setSnackbar({
        open: true,
        content: 'Error deleting group, try again!',
        type: 'error',
      })
    }
    closeAlert()
  }

  const addOrRemoveParticipant = async (action: string, user) => {
    if (action === "remove" && user.id === event.hostId) {
      setSnackbar({
        open: true,
        content: "Event creator can't be removed from event!",
        type: 'warning',
      })
      return;
    }

    try {
      const res = await callApi('/channel/user', 'POST', {
        channelId: Number(channel.id),
        participantId: Number(user?.participantId),
        action: action
      })
      if (res.status === 200) {
        fetchParticipants();
        setSnackbar({
          open: true,
          content: action === "add" ? "Participant added!" : "Participant removed!",
          type: 'success',
        })
      } else {
        setSnackbar({
          open: true,
          content: 'Error, try again!',
          type: 'error',
        })
      }
    } catch (error) {
      console.log(error)
      setSnackbar({
        open: true,
        content: 'Error, try again!',
        type: 'error',
      })
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchParticipants = async () => {
    if (channel) {
      const channelParticipants = await callApi("/channel/list?channelId=" + channel?.id, "GET")
      console.log("channel participants: ", channelParticipants.data.participants);
      setChannelParticipants(channelParticipants.data.participants);
    }

    const eventParticipants = await callApi("/event/participants?eventId=" + eventId, "GET")
    console.log("event parti: ", eventParticipants.data.users);
    setTotalParticipants(eventParticipants.data.users);
  }

  const checkStatus = (user) => {
    console.log("userId: ", user.id);
    return channelParticipants?.some(participant => participant.id === user.id) || false;
  }

  useEffect(() => {
    fetchParticipants();
    console.log("event: ", event);
  }, [channel])

  return (
    <div className="flex-col px-4 md:px-10 w-full font-josefin container">
      <Box
        display={'flex'}
        gap={2}
        className="flex flex-col bg-background-extralight my-4 px-4 md:px-8 py-8 rounded-md"
      >
        <div className="flex md:flex-row flex-col justify-between items-center w-full">
          <p className="font-bold text-center text-xl">{channel?.name}</p>

          <button onClick={handleParticipantOpen} className="flex px-2 py-1 border border-black rounded-md cursor-pointer">
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
            <span>{channelParticipants?.length || 0} People</span>
          </button>
          <Modal open={participantOpen}
            onClose={handleParticipantClose}
            className="font-josefin flex justify-center items-center">
            <Box className="bg-white p-4 rounded-md w-1/2 h-1/2">
              <div className="flex justify-between">
                <h2 className="mb-4 font-semibold text-lg">{channel?.name} Participants</h2>
                <h3>Total: {channelParticipants?.length || 0}</h3>
              </div>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                    <Tab label="Current Participants" />
                    <Tab label="Add More Participants" />
                  </Tabs>
                </Box>
                {tabValue === 0 ? <h2 className="text-lg font-semibold my-3">Current Participants</h2> : <h2 className="text-lg font-semibold my-3">Add Participants</h2>}
              </Box>
              <div className="flex flex-col gap-4 overflow-y-scroll h-[55%]">
                {tabValue === 0 ? channelParticipants?.map((participant) => (
                  <>
                    <Box
                      display={'flex'}
                      gap={2}
                      key={participant.id}
                      className="flex md:flex-row flex-col justify-between items-center gap-1 md:px-2 py-1 rounded-md text-center md:text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={participant?.profilePic || monkey}
                          sx={{ width: '50px', height: '50px' }}
                        />
                        <div className="flex flex-col gap-1">
                          <p className="flex gap-2">
                            <span className="font-semibold text-xl">
                              {participant?.name}
                            </span>
                            <span>{renderRole(participant?.role)}</span>
                          </p>
                          <span className="font-medium text-sm text-primary-dull">
                            Joined {getDate(participant?.createdDate)}
                          </span>
                        </div>
                      </div>
                      <button className="text-sm border-black border px-3 py-1 rounded-md cursor-pointer" onClick={() => addOrRemoveParticipant("remove", participant)}>Remove</button>
                    </Box>
                    <Divider />
                  </>
                )) :
                  totalParticipants?.map((participant) => (
                    <>
                      <Box
                        display={'flex'}
                        gap={2}
                        key={participant.id}
                        className="flex md:flex-row flex-col justify-between items-center gap-1 md:px-2 py-1 rounded-md text-center md:text-left"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={participant?.profilePic || monkey}
                            sx={{ width: '50px', height: '50px' }}
                          />
                          <div className="flex flex-col gap-1">
                            <p className="flex gap-2">
                              <span className="font-semibold text-xl">
                                {participant?.name}
                              </span>
                              <span>{renderRole(participant?.role)}</span>
                            </p>
                            <span className="font-medium text-sm text-primary-dull">
                              Joined {getDate(participant?.createdDate)}
                            </span>
                          </div>
                        </div>
                        <div className="pr-4 text-sm">{checkStatus(participant) ? <span>Already Added</span> : <button className="border-black border px-3 py-1 rounded-md cursor-pointer" onClick={() => addOrRemoveParticipant("add", participant)}>Add now</button>}</div>
                      </Box>
                      <Divider />
                    </>
                  ))
                }
              </div>
            </Box>
          </Modal>
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
          className="flex justify-center items-center font-josefin"
        >
          <Box className="flex flex-col gap-2 bg-white px-4 py-4 rounded-md w-1/2 h-fit">
            <h2 className="font-semibold text-lg">Create Group</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 pt-1 pb-4">
                <h2>Create groups for managing messages inside your channel</h2>
                <h3>
                  All participants who are part of channel will be able to
                  message except for groups named (Announcements, Vendor) which
                  are specific to user role
                </h3>
              </div>
              <form
                className="flex flex-col justify-center items-center gap-4 w-full"
                onSubmit={createGroup}
              >
                <input
                  placeholder="Group Name Eg. general"
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

        {channel?.GroupRelation?.map((item) => (
          <div
            className="flex md:flex-row flex-col justify-between text-center"
            key={item.id}
          >
            <span className="font-medium text-lg">
              #{item?.Group?.name.toLowerCase()}
            </span>
            <div className="flex gap-1">
              <button
                className="hover:text-gray-500 transition-all cursor-pointer"
                onClick={() => {
                  setNewGroup(item.Group)
                  handleEditOpen()
                }}
              >
                Edit
              </button>
              <span>|</span>
              <button
                className="hover:text-gray-500 transition-all cursor-pointer"
                onClick={() =>
                  setAlert({
                    open: true,
                    title: `Are you sure you want to delete ${item?.Group?.name} group?`,
                    text: "All messages will be deleted and won't be recovered later!",
                    primaryButton: 'Yes',
                    primaryAction: () => {
                      handleDelete(item)
                    },
                    secondaryButton: 'No',
                    secondaryAction: () => closeAlert(),
                  })
                }
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
