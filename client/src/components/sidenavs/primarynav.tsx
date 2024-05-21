import React, { useState } from 'react'
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
  ListItemAvatar,
  ListItemButton,
} from '@mui/material'
import Participants from '../eventcomponents/participants'
import Subevents from '../eventcomponents/subevent'
import SingleSubEvent from '../eventcomponents/singlesubevent'
import Budget from '../eventcomponents/budget'
import PaymentHistory from '../eventcomponents/paymenthistory'
import Default from './Default'
import bday from '../../assets/bday.png'
import { useNavigate } from 'react-router-dom'
import Chat from '../chat'
import CalenderEvent from '../calenderevent'

const drawerWidth = 320

type Props = {
  window?: () => Window
}

export default function SidebarNav(props: Props) {
  const navigate = useNavigate()
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [rendercomponent, setRenderComponent] = useState('')
  const [renderList, setRenderList] = useState('')
  const handleHome = () => {
    setRenderComponent('')
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

  const drawer = (
    <div className="flex flex-col font-josefin">
      <div className="flex justify-center items-center gap-2 px-2 py-2">
        <img
          src={bday}
          className="border-4 border-primary-light rounded-xl w-[35px] md:w-[55px] h-[35px] md:h-[55px]"
        />{' '}
        <div className="px-3 py-3 h-[71px]">
          <span className="font-bold text-2xl">Mayank's Bday</span>
        </div>
      </div>
      <Divider />
      <div className="flex">
        <List>
          <ListItem className="bg-white">
            <ListItemAvatar className="bg-white" onClick={handleHome}>
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
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <ListItem>
            <ListItemAvatar onClick={handleDm}>
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
            </ListItemAvatar>
          </ListItem>
          <ListItem>
            <ListItemAvatar onClick={handleCalender}>
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
            </ListItemAvatar>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
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
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </Avatar>
            </ListItemAvatar>
          </ListItem>
        </List>
        <Divider />
        {renderList === 'Home' && (
          <List>
            <ListItem className="bg-white font-medium text-lg">
              <ListItemButton
                onClick={() => setRenderComponent('Participants')}
              >
                @ Participants
              </ListItemButton>
            </ListItem>
            <ListItem className="bg-white font-medium text-lg">
              <ListItemButton onClick={() => setRenderComponent('Sub Events')}>
                @ Events
              </ListItemButton>
            </ListItem>
            <ListItem className="bg-white font-medium text-lg">
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
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  <p className="w-40"> @ Sub Events</p>
                </AccordionSummary>
                <AccordionDetails>
                  <ListItemButton
                    className="ml-3 font-josefin font-md text-black"
                    onClick={() => setRenderComponent('Information')}
                  >
                    # Celebrating
                  </ListItemButton>
                </AccordionDetails>
              </Accordion>
            </ListItem>
            <ListItem className="bg-white font-medium text-lg">
              <ListItemButton onClick={() => setRenderComponent('Budget')}>
                @ Budget
              </ListItemButton>
            </ListItem>
            <ListItem className="bg-white font-medium text-lg">
              <ListItemButton
                onClick={() => setRenderComponent('Payment History')}
              >
                @ Payment History
              </ListItemButton>
            </ListItem>
          </List>
        )}
        {/** Chat List */}
        {renderList === 'Dm' && (
          <List>
            <ListItem className="bg-white font-medium text-lg">
              <ListItemButton onClick={() => setRenderComponent('Chat')}>
                <p>
                  <span>Saakshi</span>
                  <br />
                  <span className="text-dull text-xs">
                    Joined on 25th May, 2024
                  </span>
                </p>
              </ListItemButton>
            </ListItem>
            <Divider />
          </List>
        )}
        {/* calender */}
        {renderList === 'Calender' && (
          <List>
            <ListItem className="bg-white font-medium text-lg">
              <ListItemButton
                onClick={() => setRenderComponent('Event Schedule')}
              >
                <p>
                  <span>@ Game Zone</span>
                  <br />
                  <span className="text-dull text-xs">On 25th May, 2024</span>
                </p>
              </ListItemButton>
            </ListItem>
            <Divider />
          </List>
        )}
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
        {rendercomponent === '' && renderList === 'Home' && <Default />}
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
