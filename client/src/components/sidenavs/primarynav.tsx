import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Toolbar from '@mui/material/Toolbar'
import monkey from '../../assets/monkey.png'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Popover,
  Tooltip,
} from '@mui/material'
import Participants from '../eventcomponents/participants'
import Subevents from '../eventcomponents/subevent'
import SingleSubEvent from '../eventcomponents/singlesubevent'
import Budget from '../eventcomponents/budget'
import PaymentHistory from '../eventcomponents/paymenthistory'
import Default from './Default'
import { formatDate, getDate } from '../../helpers/formatDate'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useChannelStore,
  useEventStore,
  useUserStore,
} from '../../global-store/store'
import Chat from '../chat'
import CalenderEvent from '../calenderevent'
import Groups from '../groupchatDefault'
import BookTable from '../booktable'
import Table from '../../assets/table.svg'
import useApi from '../../hooks/use-api'
import Appearance from '../appearance'
import UserSettings from '../user-settings'
import EventSettings from '../event-settings'
import EventPhotos from '../event-photos'
import ChatDefault from '../chatDefault'
import BookTableForm from '../booktable_form'
import { ChannelType, EventType } from '../../global-types/model'
import GroupChat from '../groupChat'
import useSnackbar from '../../hooks/use-snackbar'
import useAlert from '../../hooks/use-alert'

const drawerWidth = 350

type Props = {
  window?: () => Window
}

// todo :- keep a check of selected icon and selected item and 
// highlight them so user can be sure which item is selected currently 

// todo :- Ensure default page for every icon, especially for home and chat and for calender as well
// todo :- Accordian for home items as well (similar to sub events in dash)

export default function SidebarNav(props: Props) {
  const navigate = useNavigate()
  const { window } = props
  const callApi = useApi()
  const { eventId } = useParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [rendercomponent, setRenderComponent] = useState('')
  const [setAlert, closeAlert] = useAlert()
  const { user, setUser } = useUserStore((state) => state)
  const { event, setEvent } = useEventStore((state) => state)
  const { channel, setChannel } = useChannelStore((state) => state)
  const setSnackbar = useSnackbar();
  const [renderList, setRenderList] = useState(
    user.role === 'host' ? 'dash' : 'Home',
  )
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | null>(
    null,
  )
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleClose()
    closeAlert()
    localStorage.removeItem('token')
    navigate('/')
  }

  const handleBackToEvents = () => {
    handleClose()
    navigate('/allevents')
  }

  const fetchChannelDetails = async () => {
    try {
      const res = await callApi('/event/list', 'POST', {
        eventId: Number(eventId),
        includeGroup: true,
      })
      if (res.status === 200) {
        setChannel(res?.data?.events?.Channel)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getEventDetails = async () => {
    const res = await callApi('/event/' + eventId, 'GET')
    if (res) {
      const eventDetails: EventType = res.data.event
      console.log('Event details: ', eventDetails)
      setEvent(eventDetails)
      fetchChannelDetails()
    }
  }

  const fetchUserRole = async (eventId: Number) => {
    try {
      const res = await callApi('/event/user/role?eventId=' + eventId + '&userId=' + user.id);
      if (res && res.data) {
        const { isParticipant, role, participant } = res.data;

        // user is not a participant in event (display toast and redirect to home)
        if (!isParticipant) {
          console.error('User is not a participant of the event');
          setSnackbar({
            open: true,
            content: 'You are not a participant in this event!',
            type: 'warning',
          })
          navigate("/allEvents")
        } else {
          getEventDetails()
          fetchChannelDetails()
          setUser({ ...user, role, participantId: participant.id });
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  }
  useEffect(() => {
    fetchUserRole(Number(eventId))
  }, [eventId])

  const handleDash = () => {
    setRenderComponent('')
    setRenderList('Dash')
  }
  const handleHome = () => {
    setRenderComponent('Groups')
    setRenderList('Home')
  }
  const handleDm = () => {
    setRenderComponent('Chat')
    setRenderList('Dm')
  }
  const handleCalender = () => {
    setRenderComponent('Event Schedule')
    setRenderList('Calender')
  }
  const handleBookTable = () => {
    setRenderList('Book')
    setRenderComponent('Book Table')
  }
  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel)
    setRenderComponent('Information')
  }

  const handleCalenderClick = (channel) => {
    setSelectedChannel(channel)
    setRenderComponent('Event Schedule')
  }

  const handleSettings = () => {
    setRenderList('Settings')
  }

  const handlePaymentHistory = () => {
    setRenderComponent('Payment History')
  }

  useEffect(() => {
    if (user.role === "host") {
      handleDash();
    }
    console.log('User details: ', user)
    console.log('channel: ', channel)
  }, [])

  // Dashboard Items
  const dashlistitems = [
    { name: 'Participants', action: () => setRenderComponent('Participants') },
    { name: 'Events List', action: () => setRenderComponent('Sub Events') },
    {
      name: 'Sub Events',
      accordion: true,
      details: [
        {
          name: 'Celebrating',
          action: () => {
            setRenderComponent('Information')
          },
        },
      ],
    },
    { name: 'Budget', action: () => setRenderComponent('Budget') },
    {
      name: 'Payment History',
      action: () => setRenderComponent('Payment History'),
    },
    {
      name: 'Table Arranagements',
      action: () => setRenderComponent('Table Arrangements')
    }
  ]

  const drawer = (
    <div className="flex flex-col h-full font-josefin">
      <div
        className="top-0 left-0 z-10 fixed flex justify-start items-center gap-3 bg-white px-4 py-8 w-full h-[70px] font-josefin"
        style={{ width: `${drawerWidth}px` }}
      >
        <img
          src={event?.image}
          className="border-2 border-primary-light rounded-xl w-[35px] md:w-[55px] h-[35px] md:h-[55px]"
          alt="event profile"
        />
        <span className="font-bold text-2xl">{event?.name || 'Event'}</span>
      </div>
      <Divider />
      <div className="flex mt-[60px] h-full">
        <div className="left-2 z-10 fixed flex flex-col justify-between items-center my-2 h-[89%] overscroll-none">
          <List>
            {/* Dashboard */}
            {user && user.role === 'host' && (
              <Tooltip
                title="Dashboard"
                disableInteractive
                placement="bottom-end"
              >
                <ListItem
                  className="bg-white cursor-pointer"
                  onClick={handleDash}
                >
                  <Avatar className="hover:bg-background-light rounded-full transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-black transition-colors duration-200"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                      />
                    </svg>
                  </Avatar>
                </ListItem>
              </Tooltip>
            )}

            {/* Home */}
            <Tooltip title="Home" disableInteractive placement="bottom-end">
              <ListItem
                className="bg-white cursor-pointer"
                onClick={handleHome}
              >
                <Avatar className="hover:bg-background-light rounded-full transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-black transition-colors duration-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12L11.204 3.045c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </Avatar>
              </ListItem>
            </Tooltip>

            {/* DMS */}
            <Tooltip title="Messages" disableInteractive placement="bottom-end">
              <ListItem className="bg-white cursor-pointer" onClick={handleDm}>
                <Avatar className="hover:bg-background-light rounded-full transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-black transition-colors duration-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                </Avatar>
              </ListItem>
            </Tooltip>

            {/* Schedule */}
            <Tooltip
              title="Check Schedule"
              disableInteractive
              placement="bottom-end"
            >
              <ListItem
                className="bg-white cursor-pointer"
                onClick={handleCalender}
              >
                <Avatar className="hover:bg-background-light rounded-full transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-black transition-colors duration-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>
                </Avatar>
              </ListItem>
            </Tooltip>

            {/* Book My table */}
            <Tooltip title="Book Table">
              <ListItem
                className="bg-white cursor-pointer"
                onClick={handleBookTable}
              >
                <Avatar className="hover:bg-background-light rounded-full transition-colors duration-200">
                  <img src={Table} alt="Table" className="w-6 h-6" />
                </Avatar>
              </ListItem>
            </Tooltip>

            {/* Photos */}
            <Tooltip
              title="Upload or View Photos"
              disableInteractive
              placement="bottom-end"
            >
              <ListItem
                className="bg-white cursor-pointer"
                onClick={() => {
                  setRenderComponent('Photos')
                  setRenderList('photo')
                }}
              >
                <Avatar className="hover:bg-background-light rounded-full transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <g transform="translate(2 3)">
                      <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                      <circle cx="10" cy="10" r="4" />
                    </g>
                  </svg>
                </Avatar>
              </ListItem>
            </Tooltip>

            {/* More */}
            <Tooltip title="Settings">
              <ListItem
                className="bg-white cursor-pointer"
                onClick={handleSettings}
              >
                <Avatar className="hover:bg-background-light rounded-full transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="text-black transition-colors duration-200 size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </Avatar>
              </ListItem>
            </Tooltip>
          </List>

          {/* Profile */}
          <div>
            <button onClick={handleClick}>
              <Avatar
                src={user.profilePic || monkey}
                className="cursor-pointer size-6"
              />
            </button>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div style={{ padding: '2px' }}>
                <MenuItem onClick={handleBackToEvents}>
                  <span className="font-josefin">Back to All Events</span>
                </MenuItem>
                <MenuItem onClick={() => setAlert({
                  open: true,
                  title: `Sure you wanna logout from this account?`,
                  text: "This won't mean you are leaving the event, you will just logout from this account!",
                  primaryButton: 'Yes',
                  primaryAction: () => {
                    handleLogout()
                  },
                  secondaryButton: 'No',
                  secondaryAction: () => closeAlert()
                })}>
                  <span className="font-josefin">Logout</span>
                </MenuItem>
              </div>
            </Popover>
          </div>
        </div>
        <Divider />

        {/** Home */}
        <div className="ml-[50px] pl-4 w-full h-full font-josefin">
          {renderList === 'Home' &&
            channel?.map((item) => (
              <List key={item.id}>
                <ListItem className="bg-white font-medium text-lg">
                  <ListItemText
                    onClick={() => setRenderComponent('Groups')}
                    disableTypography={true}
                  >
                    @ {item?.name?.toLowerCase()}
                  </ListItemText>
                </ListItem>
                {item?.GroupRelation?.map((group) => (
                  <ListItem
                    key={group.id}
                    onClick={() => {
                      setRenderComponent('GroupChat')
                      setSelectedGroupId(group.id)
                    }}
                  >
                    <ListItemButton>
                      #{group?.Group?.name.toLowerCase()}
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider className="m-0" />
              </List>
            ))}

          {/* Dashboard */}
          {user && user.role === 'host' && renderList === 'Dash' && (
            <List>
              {dashlistitems?.map((item, index) => (
                <ListItem key={index} className="bg-white font-medium text-lg">
                  {item.accordion ? (
                    <Accordion className="!border-0 !shadow-none w-full">
                      <AccordionSummary
                        expandIcon={
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-black"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                            />
                          </svg>
                        }
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                      >
                        <p className="w-32">@ {item.name}</p>
                      </AccordionSummary>
                      <AccordionDetails>
                        {channel?.map((item, index) => (
                          <ListItemButton
                            key={index}
                            className="ml-3 w-54 font-josefin font-md text-black"
                            onClick={() => handleChannelClick(item)}
                          >
                            @ {item.name}
                          </ListItemButton>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <ListItemButton onClick={item.action}>
                      @ {item.name}
                    </ListItemButton>
                  )}
                </ListItem>
              ))}
            </List>
          )}

          {/** Chat List */}
          {renderList === 'Dm' && (
            <List>
              {event?.EventParticipant?.length > 0 ? (
                event?.EventParticipant?.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem className="bg-white font-medium text-lg">
                      <ListItemButton
                        onClick={() => {
                          setRenderComponent('Chat')
                          setSelectedUser({
                            participantId: item?.id,
                            user: item?.User,
                          })
                        }}
                      >
                        <div className="flex gap-2 items-center">
                          <Avatar
                            src={item?.User?.profilePic}
                            sx={{ width: "50px", height: "50px" }}
                          />
                          <p>
                            <span>{item?.User?.name === user.name ? item?.User?.name + " (you)" : item?.User?.name}</span>
                            <br />
                            <span className="text-dull text-xs">
                              Joined {getDate(item?.createdDate)}
                            </span>
                          </p>
                        </div>
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <div>No Participants to show!</div>
              )}
            </List>
          )}

          {/* calender */}
          {renderList === 'Calender' && (
            <List>
              {event?.Channel?.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem className="bg-white font-medium text-lg" onClick={() => handleCalenderClick(item)}>
                    <ListItemButton
                      onClick={() => setRenderComponent('Event Schedule')}
                    >
                      <div className="flex flex-col gap-2 w-full items-center">
                        <span className="text-dull text-sm">
                          {formatDate(item.startTime, item.endTime)}
                        </span>
                        <span className="text-md">{item.name}</span>
                      </div>
                    </ListItemButton>
                  </ListItem>
                  {index < event?.Channel?.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}

          {/* Settings */}
          {renderList === 'Settings' && (
            <List>
              <ListItem className="bg-white font-medium text-lg">
                <ListItemButton
                  onClick={() => setRenderComponent('Site Appearance')}
                >
                  Appearance
                </ListItemButton>
              </ListItem>
              <ListItem className="bg-white font-medium text-lg">
                <ListItemButton
                  onClick={() => setRenderComponent('User Settings')}
                >
                  User Settings
                </ListItemButton>
              </ListItem>
              <ListItem className="bg-white font-medium text-lg">
                <ListItemButton
                  onClick={() => setRenderComponent('Event Settings')}
                >
                  Event Settings
                </ListItemButton>
              </ListItem>
            </List>
          )}

          {/* BookTable */}
          {renderList === 'Book' && (
            <List>
              <ListItem className="bg-white font-medium text-lg">
                <ListItemButton
                  onClick={() => setRenderComponent('Book Table')}
                >
                  Book My Table
                </ListItemButton>
              </ListItem>
            </List>
          )}

          {/* Photos section */}
          {renderList === 'photo' && (
            <List>
              <ListItem className="bg-white font-medium text-lg">
                <ListItemButton
                  onClick={() => setRenderComponent('Photos')}
                >
                  Upload/Access Photos
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </div>
      </div>
    </div>
  )

  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="bg-white font-josefin text-primary-light">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </IconButton>
          <p className="font-bold font-josefin text-center text-xl">
            {rendercomponent}
          </p>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {rendercomponent === '' && renderList === 'Dash' && <Default />}
        {rendercomponent === 'Groups' && renderList === 'Home' && <Groups />}
        {rendercomponent === 'GroupChat' && renderList === 'Home' && <GroupChat groupId={selectedGroupId} />}
        {rendercomponent === 'Participants' && (
          <Participants participants={event.EventParticipant} />
        )}
        {rendercomponent === 'Sub Events' && (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <Subevents channels={event.Channel} />
        )}
        {rendercomponent === 'Information' && (
          <SingleSubEvent channel={selectedChannel} />
        )}
        {rendercomponent === 'Budget' && <Budget />}
        {rendercomponent === 'Payment History' && <PaymentHistory />}
        {rendercomponent === 'Chat' && renderList === 'Dm' && (
          <Chat selectedUser={selectedUser} isGroup={false} />
        )}
        {rendercomponent === 'Book Table' && renderList === 'Book' && (
          <BookTable />
        )}
        {rendercomponent === 'Table Arrangements' && renderList === 'Dash' && (
          <BookTableForm />
        )}
        {rendercomponent === 'Event Schedule' && renderList === 'Calender' && (
          <CalenderEvent channel={selectedChannel} />
        )}
        {rendercomponent === '' && renderList === 'Settings' && <Appearance />}
        {rendercomponent === 'Site Appearance' && renderList === 'Settings' && (
          <Appearance />
        )}
        {rendercomponent === 'User Settings' && renderList === 'Settings' && (
          <UserSettings />
        )}
        {rendercomponent === 'Event Settings' && renderList === 'Settings' && (
          <EventSettings />
        )}

        {rendercomponent === 'Photos' && <EventPhotos />}
      </Box>
    </Box>
  )
}
