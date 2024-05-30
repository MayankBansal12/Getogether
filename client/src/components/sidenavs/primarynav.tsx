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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  ListItemButton,
  ListItemText,
  Tooltip,
} from '@mui/material'
import Participants from '../eventcomponents/participants'
import Subevents from '../eventcomponents/subevent'
import SingleSubEvent from '../eventcomponents/singlesubevent'
import Budget from '../eventcomponents/budget'
import PaymentHistory from '../eventcomponents/paymenthistory'
import Default from './Default'
import { formatDate } from '../../helpers/formatDate'
import { useNavigate } from 'react-router-dom'
import { useEventStore, useUserStore } from '../../global-store/store'
import Chat from '../chat'
import CalenderEvent from '../calenderevent'
import Groups from '../groupchats'
import BookTable from '../booktable'

const drawerWidth = 350

type Props = {
  window?: () => Window
}

export default function SidebarNav(props: Props) {
  const navigate = useNavigate()
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [rendercomponent, setRenderComponent] = useState('')
  const [renderList, setRenderList] = useState('Dash')
  const user = useUserStore((state) => state.user)
  const event = useEventStore((state) => state.event)

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

  useEffect(() => {
    console.log('User details: ', user)
    console.log('Eent details: on primary ', event)
  }, [])

  // Dashboard Items
  const dashlistitems = [
    { name: 'Participants', action: () => setRenderComponent('Participants') },
    { name: 'Events', action: () => setRenderComponent('Sub Events') },
    {
      name: 'Sub Events',
      accordion: true,
      details: [
        {
          name: 'Celebrating',
          action: () => setRenderComponent('Information'),
        },
      ],
    },
    { name: 'Budget', action: () => setRenderComponent('Budget') },
    {
      name: 'Payment History',
      action: () => setRenderComponent('Payment History'),
    },
    {
      name: 'Book My Table',
      action: () => setRenderComponent('booktable'),
    },
  ]
  // List for DM delete this later
  const dmList = [
    {
      name: 'Saakshi',
      joinedDate: 'Joined on 25th May, 2024',
      action: () => setRenderComponent('Chat'),
    },
    {
      name: 'Arghya',
      joinedDate: 'Joined on 26th May, 2024',
      action: () => setRenderComponent('Chat'),
    },
  ]
  // Show all the events
  // const calendarList = [
  //   {
  //     event: '@ Game Zone',
  //     date: 'On 25th May, 2024',
  //     action: () => setRenderComponent('Event Schedule'),
  //   },
  //   {
  //     event: '@ Bday Party',
  //     date: 'On 25h May, 2024',
  //     action: () => setRenderComponent('Event Schedule'),
  //   },
  //   // Add more items as needed
  // ]

  const drawer = (
    <div className="py-4 font-josefin">
      <div
        className="top-0 left-0 z-10 fixed flex justify-start items-center gap-3 bg-white px-4 py-8 w-full h-[70px] font-josefin"
        style={{ width: `${drawerWidth}px` }}
      >
        <img
          src={event?.image}
          className="border-2 border-primary-light rounded-xl w-[35px] md:w-[55px] h-[35px] md:h-[55px]"
          alt="event profile"
        />
        <span className="font-bold text-2xl">Saakshi's Bday</span>
      </div>
      <Divider />
      <div className="flex mt-[50px] h-full">
        <div className="left-2 z-10 fixed flex flex-col justify-between items-center my-2 overscroll-none">
          <List>
            {/* Dashboard */}
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

            {/* More */}
            <Tooltip title="More">
              <ListItem className="bg-white cursor-pointer">
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
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z M8 13C7.44 13 7 12.55 7 12C7 11.45 7.45 11 8 11C8.55 11 9 11.45 9 12C9 12.55 8.56 13 8 13Z M16 13C15.44 13 15 12.55 15 12C15 11.45 15.45 11 16 11C16.55 11 17 11.45 17 12C17 12.55 16.56 13 16 13Z M8 13C7.44 13 7 12.55 7 12C7 11.45 7.45 11 8 11C8.55 11 9 11.45 9 12C9 12.55 8.56 13 8 13Z"
                    />
                  </svg>
                </Avatar>
              </ListItem>
            </Tooltip>
          </List>
          <Avatar
            src={user.profilePic}
            sx={{ width: 50, height: 50 }}
            className="cursor-pointer"
          />
        </div>
        <Divider />
        <div className="ml-[50px] pl-4 w-full h-full font-josefin">
          {/* // Home */}
          {renderList === 'Home' && (
            <List>
              <ListItem className="bg-white font-medium text-lg">
                <ListItemButton>@ Subevents </ListItemButton>
              </ListItem>
              <ListItem>
                <ListItemButton># Celebrate</ListItemButton>
              </ListItem>
              <Divider className="m-0" />
            </List>
          )}
          {/* // Dashboard */}
          {renderList === 'Dash' && (
            <List>
              {dashlistitems.map((item, index) => (
                <ListItem key={index} className="bg-white font-medium text-lg">
                  {item.accordion ? (
                    <Accordion className="!border-0 !shadow-none">
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
                        {item.details.map((detail, idx) => (
                          <ListItemButton
                            key={idx}
                            className="ml-3 font-josefin font-md text-black"
                            onClick={detail.action}
                          >
                            # {detail.name}
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
          {/* // Chat List */}
          {renderList === 'Dm' && (
            <List>
              {dmList.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem className="bg-white font-medium text-lg">
                    <ListItemButton onClick={item.action}>
                      <p>
                        <span>{item.name}</span>
                        <br />
                        <span className="text-dull text-xs">
                          {item.joinedDate}
                        </span>
                      </p>
                    </ListItemButton>
                  </ListItem>
                  {index < dmList.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
          {/* // calender */}
          {renderList === 'Calender' && (
            <List>
              {event?.Channel?.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem className="bg-white font-medium text-lg">
                    <ListItemButton
                      onClick={() => setRenderComponent('Event Schedule')}
                    >
                      <p className="text-center">
                        <span className="text-dull text-sm">
                          {formatDate(item.startTime, item.endTime)}
                        </span>
                        <br />
                        <span className="text-md">{item.name}</span>
                      </p>
                    </ListItemButton>
                  </ListItem>
                  {index < event?.Channel?.length - 1 && <Divider />}
                </React.Fragment>
              ))}
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
        {rendercomponent === 'booktable' && <BookTable />}
        {rendercomponent === 'Participants' && <Participants />}
        {rendercomponent === 'Sub Events' && <Subevents />}
        {rendercomponent === 'Information' && <SingleSubEvent />}
        {rendercomponent === 'Budget' && <Budget />}
        {rendercomponent === 'Payment History' && <PaymentHistory />}
        {rendercomponent === 'Chat' && renderList === 'Dm' && <Chat />}
        {rendercomponent === 'Event Schedule' && renderList === 'Calender' && (
          <CalenderEvent />
        )}
      </Box>
    </Box>
  )
}
