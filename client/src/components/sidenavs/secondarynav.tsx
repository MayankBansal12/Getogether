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
  ListItemButton,
} from '@mui/material'
import Participants from '../eventcomponents/participants'
import Subevents from '../eventcomponents/subevent'
import SingleSubEvent from '../eventcomponents/singlesubevent'
import Budget from '../eventcomponents/budget'
import PaymentHistory from '../eventcomponents/paymenthistory'
import Default from './Default'

const drawerWidth = 250

type Props = {
  window?: () => Window
}

export default function SidebarNav(props: Props) {
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [rendercomponent, setRenderComponent] = useState('')

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
    <div className="font-josefin">
      <div className="px-3 py-3">
        <span className="font-bold text-xl">Mayank's Bday</span>
      </div>
      <Divider />
      <List>
        <ListItem className="bg-white font-medium text-lg">
          <ListItemButton onClick={() => setRenderComponent('Participants')}>
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
          <ListItemButton onClick={() => setRenderComponent('Payment History')}>
            @ Payment History
          </ListItemButton>
        </ListItem>
      </List>
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
        {rendercomponent === '' && <Default />}
        {rendercomponent === 'Participants' && <Participants />}
        {rendercomponent === 'Sub Events' && <Subevents />}
        {rendercomponent === 'Information' && <SingleSubEvent />}
        {rendercomponent === 'Budget' && <Budget />}
        {rendercomponent === 'Payment History' && <PaymentHistory />}
      </Box>
    </Box>
  )
}
