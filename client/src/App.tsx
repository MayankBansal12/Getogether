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
import AllEvents from './pages/allevents'
import Host from './pages/host'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/allevents',
    element: <AllEvents />,
  },
  {
    path: '/auth/:authType?',
    element: <Auth />,
  },
  {
    path: '/host',
    element: <Host />,
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
    </>
  )
}

export default App
