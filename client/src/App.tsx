import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Protected from './components/protected'

import Home from './pages/home'
import Test from './pages/test'
import useOnline from './hooks/use-online'
import Offline from './components/offline'
import Testing2 from './pages/testing2'
import AlertDialog from './components/alert-dialog'
import Auth from './pages/auth/auth'
import PageNotFound from './pages/page-not-found'
import Navbar from './components/navbar/navbar'
import SnackbarComp from './components/snackbar'
import AllEvents from './pages/allevents'
import Dash from './pages/Dash'
import CreateEvent from './components/eventcomponents/create'
import BookTable from './components/booktable'
import SidebarNav from './components/sidenavs/primarynav'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/book-table',
    element: <BookTable />,
  },
  {
    path: '/allevents',
    element: (
      <Protected>
        <AllEvents />
      </Protected>
    ),
  },
  {
    path: '/createevent',
    element: (
      <Protected>
        <CreateEvent />
      </Protected>
    ),
  },
  {
    path: '/auth/:authType?',
    element: <Auth />,
  },
  {
    path: '/event/:eventId',
    element: (
      <Protected>
        <Dash />
      </Protected>
    ),
  },
  {
    path: '/test',
    element: (
      <Protected>
        <Test />
      </Protected>
    ),
  },
  {
    path: '/alert',
    element: <Testing2 />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
])

const App = () => {
  const online = useOnline()
  return (
    <>
      {/* <Navbar /> */}
      <RouterProvider router={router} />
      {/* All other stuff */}
      {!online && <Offline />}
      <AlertDialog />
      <SnackbarComp />
    </>
  )
}

export default App
